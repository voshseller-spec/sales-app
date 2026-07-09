// Demo mode: the entire API runs in the browser. Reuses the same mock
// adapters and pure domain modules as the server, with localStorage in place
// of the JSON-file db. Installed before the app mounts (see main.tsx), it
// intercepts fetch("/api/…") calls so the UI code is byte-identical to the
// server-backed build.
import { trendSeeds } from "../../server/data/trendSeeds.js";
import { rankTemplates } from "../../server/lib/fitScore.js";
import { checkCompliance, DISCLAIMER } from "../../server/lib/compliance.js";
import { normalizeProduct } from "../../server/lib/product.js";
import { PLANS } from "../../server/lib/plans.js";
import { createMockLlmAdapter } from "../../server/adapters/llm/mockLlm.js";
import { createMockVideoAdapter } from "../../server/adapters/video/mockVideo.js";

type Db = {
  user: { plan: string; rendersUsedThisMonth: number };
  renders: any[];
  performanceLogs: Record<string, any>;
};

const KEY = "trendforge-demo-db";

function loadDb(): Db {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* private mode etc. — fall through to memory-only */ }
  return { user: { plan: "free", rendersUsedThisMonth: 0 }, renders: [], performanceLogs: {} };
}

const db = loadDb();

function saveDb() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch { /* memory-only fallback */ }
}

const llm = createMockLlmAdapter();
const video = createMockVideoAdapter();

function templatesWithWins() {
  const wins: Record<string, number> = {};
  for (const r of db.renders) {
    const log = db.performanceLogs[r.id];
    if (log && Number(log.views) > 10000 && r.trendTemplateId) wins[r.trendTemplateId] = (wins[r.trendTemplateId] || 0) + 1;
  }
  return trendSeeds.map((t: any) => ({ ...t, _firstPartyWins: wins[t.id] || 0 }));
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

async function handle(method: string, url: URL, body: any): Promise<Response> {
  const p = url.pathname;

  if (p === "/api/health") {
    return json({
      ok: true,
      adapters: { llm: "mock-llm (in-browser demo)", trends: ["mock-trends (in-browser demo)"], video: "mock-video (in-browser demo)" },
    });
  }

  if (p === "/api/trends" && method === "GET") {
    const niche = url.searchParams.get("niche");
    const platform = url.searchParams.get("platform");
    const goal = url.searchParams.get("goal");
    let templates = templatesWithWins();
    if (niche && niche !== "all") templates = templates.filter((t: any) => t.niches.includes(niche));
    if (platform && platform !== "all") templates = templates.filter((t: any) => t.platforms.includes(platform));
    if (goal && goal !== "all") templates = templates.filter((t: any) => t.goals.includes(goal));
    templates.sort((a: any, b: any) => b.momentumScore - a.momentumScore);
    return json({ templates, sources: ["mock-trends (in-browser demo)"] });
  }

  if (p === "/api/trends/match") {
    if (!body?.product?.name) return json({ error: "Product profile required." }, 400);
    return json({ matches: rankTemplates(templatesWithWins(), body.product, body.goal, { limit: 6 }) });
  }

  if (p === "/api/product/normalize") return json({ product: normalizeProduct(body || {}) });

  if (p === "/api/product/scrape") {
    return json({
      fallback: true,
      reason: "URL scraping needs the server build (it runs in this hosted demo's browser sandbox) — fill in the fields manually or use the preset.",
    });
  }

  if (p === "/api/scripts") {
    if (!body?.product?.name) return json({ error: "Product profile required." }, 400);
    const all = templatesWithWins();
    const templates = body.templateIds?.length
      ? body.templateIds.map((id: string) => all.find((t: any) => t.id === id)).filter(Boolean)
      : rankTemplates(all, body.product, body.goal, { limit: 3 });
    const scripts = await llm.generateScripts({ product: body.product, goal: body.goal, templates });
    return json({ scripts, llm: "mock-llm (in-browser demo)" });
  }

  if (p === "/api/storyboard") {
    if (!body?.script?.body) return json({ error: "Script required." }, 400);
    const template = templatesWithWins().find((t: any) => t.id === (body.templateId || body.script.trendTemplateId)) || null;
    const scenes = await llm.generateStoryboard({ product: body.product, script: body.script, template });
    return json({ scenes });
  }

  if (p === "/api/compliance/check") {
    const result = checkCompliance(body?.text || "", { category: body?.category, allowedClaims: body?.allowedClaims });
    return json({ ...result, disclaimer: result.regulated ? DISCLAIMER : null });
  }

  if (p === "/api/renders" && method === "POST") {
    const { product, scenes, scriptId, trendTemplateId, trendTemplateName, ratio = "9:16" } = body || {};
    if (!product?.name || !Array.isArray(scenes) || !scenes.length) {
      return json({ error: "Product and storyboard scenes are required." }, 400);
    }
    const plan = (PLANS as any)[db.user.plan] || (PLANS as any).free;
    if (db.user.rendersUsedThisMonth >= plan.rendersPerMonth) {
      return json(
        { error: `Monthly render limit reached (${plan.rendersPerMonth} on ${plan.label}). Upgrade or top up credits to continue.`, code: "usage_cap" },
        402
      );
    }
    if (!plan.exportRatios.includes(ratio)) {
      return json({ error: `${ratio} export requires the Creator plan or above.`, code: "plan_gate" }, 402);
    }

    const fullText = scenes.map((s: any) => `${s.voiceoverText || ""} ${s.onScreenText || ""}`).join(" ");
    const compliance = checkCompliance(fullText, { category: product.category, allowedClaims: product.allowedClaims });

    const render: any = {
      id: `render-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "queued",
      progressPct: 0,
      stage: "Queued",
      createdAt: new Date().toISOString(),
      ratio,
      watermark: plan.watermark,
      modelTier: plan.modelTier,
      videoAdapter: "mock-video (in-browser demo)",
      product: { name: product.name, category: product.category },
      scriptId: scriptId || null,
      trendTemplateId: trendTemplateId || null,
      trendTemplateName: trendTemplateName || null,
      sceneCount: scenes.length,
      compliance: { ...compliance, disclaimer: compliance.regulated ? DISCLAIMER : null },
      costCredits: scenes.length,
      output: null,
    };

    db.user.rendersUsedThisMonth += 1;
    db.renders.unshift(render);
    saveDb();

    // Async render, same staged mock pipeline as the server.
    (async () => {
      render.status = "rendering";
      try {
        render.output = await video.render(
          { scenes, product, watermark: plan.watermark, ratio },
          ({ pct, stage }: { pct: number; stage: string }) => {
            render.progressPct = pct;
            render.stage = stage;
            saveDb();
          }
        );
        render.status = "done";
        render.progressPct = 100;
        render.stage = "Complete";
      } catch {
        render.status = "failed";
        render.stage = "Failed";
      }
      saveDb();
    })();

    return json({ render }, 202);
  }

  if (p === "/api/renders" && method === "GET") {
    return json({ renders: db.renders.map((r) => ({ ...r, performance: db.performanceLogs[r.id] || null })) });
  }

  const renderMatch = p.match(/^\/api\/renders\/([^/]+)$/);
  if (renderMatch && method === "GET") {
    const render = db.renders.find((r) => r.id === renderMatch[1]);
    if (!render) return json({ error: "Render not found." }, 404);
    return json({ render: { ...render, performance: db.performanceLogs[render.id] || null } });
  }

  const perfMatch = p.match(/^\/api\/renders\/([^/]+)\/performance$/);
  if (perfMatch && method === "POST") {
    const render = db.renders.find((r) => r.id === perfMatch[1]);
    if (!render) return json({ error: "Render not found." }, 404);
    db.performanceLogs[render.id] = {
      views: Number(body?.views) || 0,
      ctr: Number(body?.ctr) || 0,
      spend: Number(body?.spend) || 0,
      notes: (body?.notes || "").slice(0, 500),
      loggedAt: new Date().toISOString(),
    };
    saveDb();
    return json({ ok: true, performance: db.performanceLogs[render.id] });
  }

  if (p === "/api/usage" && method === "GET") {
    const plan = (PLANS as any)[db.user.plan] || (PLANS as any).free;
    return json({ plan, plans: Object.values(PLANS), used: db.user.rendersUsedThisMonth, limit: plan.rendersPerMonth });
  }

  if (p === "/api/usage/plan") {
    if (!(PLANS as any)[body?.plan]) return json({ error: "Unknown plan." }, 400);
    db.user.plan = body.plan;
    saveDb();
    return json({ ok: true, plan: (PLANS as any)[body.plan] });
  }

  return json({ error: `Unknown demo endpoint: ${method} ${p}` }, 404);
}

export function installDemoApi() {
  const orig = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (raw.startsWith("/api/")) {
      const method = (init?.method || (typeof input !== "string" && !(input instanceof URL) ? input.method : "GET") || "GET").toUpperCase();
      let body: any = null;
      if (init?.body) {
        try {
          body = JSON.parse(String(init.body));
        } catch { /* non-JSON body */ }
      }
      try {
        return await handle(method, new URL(raw, "http://demo.local"), body);
      } catch (err) {
        return json({ error: err instanceof Error ? err.message : "Demo API error." }, 500);
      }
    }
    return orig(input as any, init);
  };
}
