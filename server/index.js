import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAdapters } from "./adapters/index.js";
import { loadDb, saveDb, db } from "./lib/db.js";
import { PLANS } from "./lib/plans.js";
import { rankTemplates } from "./lib/fitScore.js";
import { normalizeProduct, scrapeProductUrl } from "./lib/product.js";
import { checkCompliance, DISCLAIMER } from "./lib/compliance.js";
import { enqueue } from "./lib/queue.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: "12mb" })); // image uploads arrive as data URLs

const adapters = buildAdapters();
loadDb();

// ---------------------------------------------------------------- trends ---
// Cached daily — trend clusters are shared, never re-queried per user.
let trendCache = { at: 0, templates: [] };
const TREND_TTL_MS = 24 * 60 * 60 * 1000;

async function getTrendTemplates() {
  if (Date.now() - trendCache.at < TREND_TTL_MS && trendCache.templates.length) return trendCache.templates;
  const all = new Map();
  for (const source of adapters.trendSources) {
    for (const t of await source.fetchTrends("all")) if (!all.has(t.id)) all.set(t.id, t);
  }
  // First-party signal: count logged wins per template to bias ranking.
  const wins = {};
  for (const r of db().renders) {
    const log = db().performanceLogs[r.id];
    if (log && Number(log.views) > 10000 && r.trendTemplateId) wins[r.trendTemplateId] = (wins[r.trendTemplateId] || 0) + 1;
  }
  trendCache = {
    at: Date.now(),
    templates: [...all.values()].map((t) => ({ ...t, _firstPartyWins: wins[t.id] || 0 })),
  };
  return trendCache.templates;
}

app.get("/api/trends", async (req, res) => {
  const { niche, platform, goal } = req.query;
  let templates = await getTrendTemplates();
  if (niche && niche !== "all") templates = templates.filter((t) => t.niches.includes(niche));
  if (platform && platform !== "all") templates = templates.filter((t) => t.platforms.includes(platform));
  if (goal && goal !== "all") templates = templates.filter((t) => t.goals.includes(goal));
  templates = [...templates].sort((a, b) => b.momentumScore - a.momentumScore);
  res.json({ templates, sources: adapters.trendSources.map((t) => t.name) });
});

app.post("/api/trends/match", async (req, res) => {
  const { product, goal } = req.body || {};
  if (!product?.name) return res.status(400).json({ error: "Product profile required." });
  const templates = await getTrendTemplates();
  res.json({ matches: rankTemplates(templates, product, goal, { limit: 6 }) });
});

// --------------------------------------------------------------- product ---
app.post("/api/product/normalize", (req, res) => {
  res.json({ product: normalizeProduct(req.body || {}) });
});

app.post("/api/product/scrape", async (req, res) => {
  const { url } = req.body || {};
  if (!url || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: "A valid http(s) URL is required." });
  const result = await scrapeProductUrl(url);
  if (result.fallback) return res.json(result);
  res.json({ fallback: false, product: normalizeProduct(result.product) });
});

// --------------------------------------------------------------- scripts ---
app.post("/api/scripts", async (req, res) => {
  const { product, goal, templateIds } = req.body || {};
  if (!product?.name) return res.status(400).json({ error: "Product profile required." });
  try {
    const all = await getTrendTemplates();
    const templates = templateIds?.length
      ? templateIds.map((id) => all.find((t) => t.id === id)).filter(Boolean)
      : rankTemplates(all, product, goal, { limit: 3 });
    const scripts = await adapters.llm.generateScripts({ product, goal, templates });
    res.json({ scripts, llm: adapters.llm.name });
  } catch (err) {
    console.error("scripts:", err);
    res.status(500).json({ error: "Script generation failed. Try again." });
  }
});

app.post("/api/storyboard", async (req, res) => {
  const { product, script, templateId } = req.body || {};
  if (!script?.body) return res.status(400).json({ error: "Script required." });
  try {
    const all = await getTrendTemplates();
    const template = all.find((t) => t.id === (templateId || script.trendTemplateId)) || null;
    const scenes = await adapters.llm.generateStoryboard({ product, script, template });
    res.json({ scenes });
  } catch (err) {
    console.error("storyboard:", err);
    res.status(500).json({ error: "Storyboard generation failed. Try again." });
  }
});

// ------------------------------------------------------------ compliance ---
app.post("/api/compliance/check", (req, res) => {
  const { text, category, allowedClaims } = req.body || {};
  const result = checkCompliance(text || "", { category, allowedClaims });
  res.json({ ...result, disclaimer: result.regulated ? DISCLAIMER : null });
});

// ---------------------------------------------------------------- renders ---
app.post("/api/renders", async (req, res) => {
  const { product, scenes, scriptId, trendTemplateId, trendTemplateName, ratio = "9:16" } = req.body || {};
  if (!product?.name || !Array.isArray(scenes) || !scenes.length) {
    return res.status(400).json({ error: "Product and storyboard scenes are required." });
  }

  // Server-side usage cap (spec §11 — never trust the client meter).
  const user = db().user;
  const plan = PLANS[user.plan] || PLANS.free;
  if (user.rendersUsedThisMonth >= plan.rendersPerMonth) {
    return res.status(402).json({
      error: `Monthly render limit reached (${plan.rendersPerMonth} on ${plan.label}). Upgrade or top up credits to continue.`,
      code: "usage_cap",
    });
  }
  if (!plan.exportRatios.includes(ratio)) {
    return res.status(402).json({ error: `${ratio} export requires the Creator plan or above.`, code: "plan_gate" });
  }

  // Compliance gate — computed at render time; export UI blocks on failure.
  const fullText = scenes.map((s) => `${s.voiceoverText || ""} ${s.onScreenText || ""}`).join(" ");
  const compliance = checkCompliance(fullText, {
    category: product.category,
    allowedClaims: product.allowedClaims,
  });

  const render = {
    id: `render-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "queued", // queued -> rendering -> done | failed
    progressPct: 0,
    stage: "Queued",
    createdAt: new Date().toISOString(),
    ratio,
    watermark: plan.watermark,
    modelTier: plan.modelTier,
    videoAdapter: adapters.video.name,
    product: { name: product.name, category: product.category },
    scriptId: scriptId || null,
    trendTemplateId: trendTemplateId || null,
    trendTemplateName: trendTemplateName || null,
    sceneCount: scenes.length,
    compliance: { ...compliance, disclaimer: compliance.regulated ? DISCLAIMER : null },
    costCredits: scenes.length, // 1 credit per scene on the mock tier
    output: null,
  };

  user.rendersUsedThisMonth += 1;
  db().renders.unshift(render);
  saveDb();

  // Always async: queue + progress + push-style completion (spec §4.5).
  enqueue(async () => {
    render.status = "rendering";
    try {
      render.output = await adapters.video.render(
        { scenes, product, watermark: plan.watermark, ratio },
        ({ pct, stage }) => {
          render.progressPct = pct;
          render.stage = stage;
          saveDb();
        }
      );
      render.status = "done";
      render.progressPct = 100;
      render.stage = "Complete";
    } catch (err) {
      console.error("render:", err);
      render.status = "failed";
      render.stage = "Failed";
    }
    saveDb();
  });

  res.status(202).json({ render });
});

app.get("/api/renders", (req, res) => {
  res.json({
    renders: db().renders.map((r) => ({ ...r, performance: db().performanceLogs[r.id] || null })),
  });
});

app.get("/api/renders/:id", (req, res) => {
  const render = db().renders.find((r) => r.id === req.params.id);
  if (!render) return res.status(404).json({ error: "Render not found." });
  res.json({ render: { ...render, performance: db().performanceLogs[render.id] || null } });
});

// Performance log — feeds the trend ranker's first-party signal.
app.post("/api/renders/:id/performance", (req, res) => {
  const render = db().renders.find((r) => r.id === req.params.id);
  if (!render) return res.status(404).json({ error: "Render not found." });
  const { views, ctr, spend, notes } = req.body || {};
  db().performanceLogs[render.id] = {
    views: Number(views) || 0,
    ctr: Number(ctr) || 0,
    spend: Number(spend) || 0,
    notes: (notes || "").slice(0, 500),
    loggedAt: new Date().toISOString(),
  };
  trendCache.at = 0; // recompute first-party bias on next trend fetch
  saveDb();
  res.json({ ok: true, performance: db().performanceLogs[render.id] });
});

// ------------------------------------------------------------------ user ---
app.get("/api/usage", (req, res) => {
  const user = db().user;
  const plan = PLANS[user.plan] || PLANS.free;
  res.json({ plan, plans: Object.values(PLANS), used: user.rendersUsedThisMonth, limit: plan.rendersPerMonth });
});

// Mock plan switcher so tiers/caps can be demoed end-to-end.
app.post("/api/usage/plan", (req, res) => {
  const { plan } = req.body || {};
  if (!PLANS[plan]) return res.status(400).json({ error: "Unknown plan." });
  db().user.plan = plan;
  saveDb();
  res.json({ ok: true, plan: PLANS[plan] });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    adapters: { llm: adapters.llm.name, trends: adapters.trendSources.map((t) => t.name), video: adapters.video.name },
  });
});

// ------------------------------------------------------------ static SPA ---
const dist = path.join(__dirname, "..", "dist");
app.use(express.static(dist));
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(dist, "index.html"), (err) => {
    if (err) res.status(404).send("Build the frontend first: npm run build");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TrendForge UGC running on http://localhost:${PORT}`);
});
