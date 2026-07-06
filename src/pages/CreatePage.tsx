import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "../lib/api";
import { STEP_ORDER, useWizard, type WizardStep } from "../store";
import type { ProductProfile, Render, Scene, ScriptVariant, TrendTemplate } from "../types";
import { Badge, Button, ProgressBar, SectionTitle, Spinner } from "../components/ui";
import TrendCard from "../components/TrendCard";
import StoryboardEditor from "../components/StoryboardEditor";
import PreviewPlayer from "../components/PreviewPlayer";
import { exportRenderAsVideo, downloadBlob } from "../lib/exportVideo";

const STEP_LABELS: Record<WizardStep, string> = {
  product: "Product",
  goal: "Goal",
  trend: "Trend",
  script: "Script",
  storyboard: "Storyboard",
  render: "Render",
};

const GOALS = [
  { id: "energy", label: "⚡ Energy", hint: "beat the crash, cleaner energy" },
  { id: "focus", label: "🎯 Focus", hint: "deep work, study, no distraction" },
  { id: "daily-routine", label: "🌅 Daily routine", hint: "habit-fit, morning/evening" },
  { id: "before-after", label: "📈 Before / After", hint: "transformation receipts" },
];

// §9 vertical preset — pre-loads a compliant supplement profile.
const SUPPLEMENT_PRESET = {
  name: "Caffeine + L-Theanine Focus Pills",
  category: "supplements",
  description: "Clean energy capsules — caffeine with l-theanine for smooth focus, no jitters",
  keyClaims: ["Smooth, steady energy without jitters", "Supports focus during work or study", "One capsule replaces the 3rd coffee", "No crash in the afternoon"],
  price: "$24.99",
  targetAudience: "young professionals and students who overdo coffee",
};

export default function CreatePage() {
  const w = useWizard();
  const [error, setError] = useState("");

  const stepIndex = STEP_ORDER.indexOf(w.step);
  const canJump = (s: WizardStep) => STEP_ORDER.indexOf(s) < stepIndex;

  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle title="Create UGC Ad" subtitle="Find what's working right now for products like yours — and generate your version in that exact format." />

      {/* Stepper */}
      <div className="scrollbar-none mb-6 flex gap-2 overflow-x-auto">
        {STEP_ORDER.map((s, i) => (
          <button
            key={s}
            onClick={() => canJump(s) && w.setStep(s)}
            disabled={!canJump(s)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              s === w.step
                ? "bg-ember-500 text-white"
                : canJump(s)
                  ? "bg-white/10 text-mist-100 hover:bg-white/20 cursor-pointer"
                  : "bg-white/5 text-mist-500"
            }`}
          >
            <span>{i + 1}</span> {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
          <button className="ml-3 underline cursor-pointer" onClick={() => setError("")}>dismiss</button>
        </div>
      )}

      {w.step === "product" && <ProductStep onError={setError} />}
      {w.step === "goal" && <GoalStep />}
      {w.step === "trend" && <TrendStep onError={setError} />}
      {w.step === "script" && <ScriptStep onError={setError} />}
      {w.step === "storyboard" && <StoryboardStep onError={setError} />}
      {w.step === "render" && <RenderStep onError={setError} />}
    </div>
  );
}

/* ------------------------------------------------------------- product --- */
function ProductStep({ onError }: { onError: (e: string) => void }) {
  const w = useWizard();
  const [mode, setMode] = useState<"text" | "url" | "image">("text");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: w.product?.name || "",
    description: "",
    keyClaims: w.product?.keyClaims.join("\n") || "",
    price: w.product?.price || "",
    targetAudience: w.product?.targetAudience || "",
  });
  const [url, setUrl] = useState("");
  const [scrapeNote, setScrapeNote] = useState("");
  const [images, setImages] = useState<string[]>(w.product?.images || []);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyPreset = () => {
    setForm({
      name: SUPPLEMENT_PRESET.name,
      description: SUPPLEMENT_PRESET.description,
      keyClaims: SUPPLEMENT_PRESET.keyClaims.join("\n"),
      price: SUPPLEMENT_PRESET.price,
      targetAudience: SUPPLEMENT_PRESET.targetAudience,
    });
    setMode("text");
  };

  const scrape = async () => {
    setBusy(true);
    setScrapeNote("");
    try {
      const res = await api.scrapeProduct(url);
      if (res.fallback || !res.product) {
        setScrapeNote(res.reason || "Couldn't scrape — fill in the details manually below.");
        setMode("text");
      } else {
        setForm({
          name: res.product.name,
          description: "",
          keyClaims: res.product.keyClaims.join("\n"),
          price: res.product.price,
          targetAudience: "",
        });
        setImages(res.product.images);
        setScrapeNote("Scraped! Review and edit the fields below, then continue.");
        setMode("text");
      }
    } catch (e) {
      setScrapeNote(e instanceof Error ? e.message : "Scrape failed — enter details manually.");
      setMode("text");
    } finally {
      setBusy(false);
    }
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImages((prev) => [...prev.slice(0, 4), String(reader.result)]);
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!form.name.trim()) return onError("Give your product a name first.");
    setBusy(true);
    try {
      const { product } = await api.normalizeProduct({
        name: form.name,
        description: form.description,
        keyClaims: form.keyClaims.split("\n").map((c) => c.trim()).filter(Boolean),
        price: form.price,
        targetAudience: form.targetAudience,
        images,
      });
      w.setProduct(product);
      w.setStep("goal");
      onError("");
    } catch (e) {
      onError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["text", "url", "image"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer ${mode === m ? "bg-ember-500 text-white" : "bg-white/5 text-mist-300 hover:bg-white/10"}`}
          >
            {m === "text" ? "✏️ Describe it" : m === "url" ? "🔗 Paste URL" : "🖼 Upload image"}
          </button>
        ))}
        <button onClick={applyPreset} className="ml-auto rounded-lg border border-gold-400/40 px-3 py-1.5 text-xs font-semibold text-gold-400 hover:bg-gold-400/10 cursor-pointer">
          💊 Supplement — Energy/Focus preset
        </button>
      </div>

      {mode === "url" && (
        <div className="mb-4">
          <label className="text-xs text-mist-500">Product page URL (we'll extract title, images, claims, price — manual override always available)</label>
          <div className="mt-1 flex gap-2">
            <input className="input" placeholder="https://yourstore.com/products/…" value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button onClick={scrape} disabled={busy || !url}>{busy ? "Scraping…" : "Scrape"}</Button>
          </div>
        </div>
      )}
      {scrapeNote && <p className="mb-3 text-xs text-amber-300">{scrapeNote}</p>}

      {mode === "image" && (
        <div className="mb-4">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>＋ Add product image</Button>
          <p className="mt-2 text-xs text-mist-500">Images guide the visual prompts. Add details below too.</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-4 flex gap-2">
          {images.map((src, i) => (
            <img key={i} src={src} alt="" className="h-16 w-16 rounded-lg border border-white/10 object-cover" />
          ))}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-xs text-mist-500">
          Product name *
          <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Caffeine + L-Theanine Focus Pills" />
        </label>
        <label className="block text-xs text-mist-500">
          Price
          <input className="input mt-1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$24.99" />
        </label>
        <label className="block text-xs text-mist-500 md:col-span-2">
          Short description
          <input className="input mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is it, in one sentence?" />
        </label>
        <label className="block text-xs text-mist-500 md:col-span-2">
          Key claims — one per line (these become your allowed-claims allowlist)
          <textarea className="input mt-1 min-h-20" value={form.keyClaims} onChange={(e) => setForm({ ...form, keyClaims: e.target.value })} placeholder={"Smooth energy without jitters\nSupports focus"} />
        </label>
        <label className="block text-xs text-mist-500 md:col-span-2">
          Target audience
          <input className="input mt-1" value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })} placeholder="who is this for?" />
        </label>
      </div>

      <Button onClick={submit} disabled={busy} className="glow-cta mt-5 w-full !py-3 text-base">
        {busy ? "Analyzing…" : "Create UGC Ad Now →"}
      </Button>
    </div>
  );
}

/* ---------------------------------------------------------------- goal --- */
function GoalStep() {
  const w = useWizard();
  return (
    <div>
      <p className="mb-4 text-sm text-mist-300">
        What should this ad drive for <span className="font-semibold text-white">{w.product?.name}</span>?
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              w.setGoal(g.id);
              w.setStep("trend");
            }}
            className={`card card-hover p-5 text-left cursor-pointer ${w.goal === g.id ? "!border-ember-500/60" : ""}`}
          >
            <div className="text-lg font-bold text-white">{g.label}</div>
            <div className="mt-1 text-xs text-mist-300">{g.hint}</div>
          </button>
        ))}
      </div>
      {w.product?.complianceFlags.includes("supplements") && (
        <p className="mt-4 text-xs text-amber-300">
          ⚠ Regulated vertical detected (supplements). Scripts stay inside your allowed-claims list and pass a compliance gate before export.
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- trend --- */
function TrendStep({ onError }: { onError: (e: string) => void }) {
  const w = useWizard();
  const [matches, setMatches] = useState<TrendTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!w.product) return;
    api
      .matchTrends(w.product, w.goal)
      .then((r) => setMatches(r.matches))
      .catch((e) => onError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const choose = (t: TrendTemplate) => {
    w.setTrend(t);
    w.setStep("script");
  };

  if (loading) return <div className="py-16 text-center"><Spinner label="Matching live trend formats to your product…" /></div>;

  return (
    <div>
      <p className="mb-4 text-sm text-mist-300">
        {matches.length} formats are working <em>right now</em> for products like yours. Pick one — your script and storyboard will be built in that exact format.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {matches.map((t) => (
          <TrendCard key={t.id} trend={t} onMakeMyVersion={choose} />
        ))}
      </div>
      <Button variant="ghost" className="mt-4" onClick={() => { w.setTrend(null); w.setStep("script"); }}>
        Skip — use a classic UGC structure
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------- script --- */
function ScriptStep({ onError }: { onError: (e: string) => void }) {
  const w = useWizard();
  const [loading, setLoading] = useState(w.scripts.length === 0);

  const generate = async () => {
    if (!w.product) return;
    setLoading(true);
    try {
      const templateIds = w.trend ? [w.trend.id] : undefined;
      const { scripts } = await api.generateScripts(w.product, w.goal, templateIds);
      w.setScripts(scripts);
      onError("");
    } catch (e) {
      onError(e instanceof Error ? e.message : "Script generation failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (w.scripts.length === 0) generate();
  }, []);

  const choose = async (script: ScriptVariant) => {
    w.setScript(script);
    w.setScenes([]);
    w.setStep("storyboard");
  };

  if (loading) return <div className="py-16 text-center"><Spinner label="Writing 3 authentic-creator script variants…" /></div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-mist-300">3 variants, each mapped to a trend format. Pick the voice that sounds like you.</p>
        <Button variant="ghost" onClick={generate}>↻ Regenerate all</Button>
      </div>
      <div className="space-y-4">
        {w.scripts.map((s) => (
          <div key={s.id} className="card card-hover p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge tone="ember">{s.trendTemplateName}</Badge>
              <Badge>~{s.estimatedDurationSec}s</Badge>
            </div>
            <p className="mb-3 text-base font-bold text-white">"{s.hook}"</p>
            <div className="space-y-1.5">
              {s.body.map((b, i) => (
                <p key={i} className="text-[13px] leading-relaxed text-mist-300">
                  <span className="mr-1.5 font-mono text-[10px] uppercase text-ember-400">{b.beat}</span>
                  {b.text}
                </p>
              ))}
            </div>
            <Button onClick={() => choose(s)} className="mt-4">Use this script →</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- storyboard --- */
function StoryboardStep({ onError }: { onError: (e: string) => void }) {
  const w = useWizard();
  const [loading, setLoading] = useState(w.scenes.length === 0);
  const [regenId, setRegenId] = useState<string | null>(null);

  useEffect(() => {
    if (w.scenes.length > 0 || !w.product || !w.script) return;
    api
      .generateStoryboard(w.product, w.script, w.trend?.id)
      .then((r) => w.setScenes(r.scenes))
      .catch((e) => onError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const regenerateScene = async (scene: Scene) => {
    if (!w.product || !w.script) return;
    setRegenId(scene.id);
    try {
      const { scenes } = await api.generateStoryboard(w.product, w.script, w.trend?.id);
      const fresh = scenes.find((s) => s.beat === scene.beat) || scenes[Math.min(scene.order, scenes.length - 1)];
      w.setScenes(w.scenes.map((s) => (s.id === scene.id ? { ...fresh, id: scene.id, order: s.order } : s)));
    } catch (e) {
      onError(e instanceof Error ? e.message : "Regenerate failed.");
    } finally {
      setRegenId(null);
    }
  };

  if (loading) return <div className="py-16 text-center"><Spinner label="Deriving scene-by-scene storyboard…" /></div>;

  const total = w.scenes.reduce((s, sc) => s + sc.durationSec, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-mist-300">
          {w.scenes.length} scenes · ~{total}s total{w.trend ? <> · paced for <span className="text-white">{w.trend.name}</span></> : null}
        </p>
        <Button onClick={() => w.setStep("render")} className="glow-cta">Generate video →</Button>
      </div>
      <StoryboardEditor scenes={w.scenes} onChange={w.setScenes} onRegenerateScene={regenerateScene} regeneratingId={regenId} />
      <Button onClick={() => w.setStep("render")} className="glow-cta mt-5 w-full !py-3 text-base">Generate video →</Button>
    </div>
  );
}

/* -------------------------------------------------------------- render --- */
function RenderStep({ onError }: { onError: (e: string) => void }) {
  const w = useWizard();
  const [render, setRender] = useState<Render | null>(w.render);
  const [starting, setStarting] = useState(false);
  const [ratio, setRatio] = useState("9:16");
  const [exporting, setExporting] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = async () => {
    if (!w.product || !w.scenes.length) return;
    setStarting(true);
    try {
      const { render: r } = await api.startRender({
        product: w.product,
        scenes: w.scenes,
        scriptId: w.script?.id,
        trendTemplateId: w.trend?.id || w.script?.trendTemplateId,
        trendTemplateName: w.trend?.name || w.script?.trendTemplateName,
        ratio,
      });
      setRender(r);
      w.setRender(r);
      onError("");
    } catch (e) {
      if (e instanceof ApiError && (e.code === "usage_cap" || e.code === "plan_gate")) {
        onError(`${e.message} (manage your plan in Profile)`);
      } else {
        onError(e instanceof Error ? e.message : "Render failed to start.");
      }
    } finally {
      setStarting(false);
    }
  };

  // Poll job progress — renders are always async, never a dead spinner.
  useEffect(() => {
    if (!render || render.status === "done" || render.status === "failed") return;
    pollRef.current = setInterval(async () => {
      try {
        const { render: r } = await api.getRender(render.id);
        setRender(r);
        w.setRender(r);
        if (r.status === "done" || r.status === "failed") clearInterval(pollRef.current!);
      } catch { /* transient poll errors are fine */ }
    }, 900);
    return () => clearInterval(pollRef.current!);
  }, [render?.id, render?.status]);

  const doExport = async () => {
    if (!render?.output) return;
    setExporting(0);
    try {
      const blob = await exportRenderAsVideo(render.output, setExporting);
      downloadBlob(blob, `${render.product.name.replace(/\W+/g, "-").toLowerCase()}-${render.ratio.replace(":", "x")}.webm`);
    } finally {
      setExporting(null);
    }
  };

  if (!render) {
    return (
      <div className="card p-6 text-center">
        <h3 className="mb-1 text-lg font-bold text-white">Ready to render</h3>
        <p className="mb-4 text-sm text-mist-300">
          {w.scenes.length} scenes → image gen → motion → voiceover → assembly → captions. Runs async — you can leave this screen.
        </p>
        <div className="mb-4 flex justify-center gap-2">
          {["9:16", "1:1", "16:9"].map((r) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer ${ratio === r ? "bg-ember-500 text-white" : "bg-white/5 text-mist-300 hover:bg-white/10"}`}
            >
              {r} {r === "9:16" ? "· TikTok/Reels/Shorts" : ""}
            </button>
          ))}
        </div>
        <Button onClick={start} disabled={starting} className="glow-cta !px-8 !py-3 text-base">
          {starting ? "Queueing…" : "🎬 Start render"}
        </Button>
      </div>
    );
  }

  const comp = render.compliance;

  return (
    <div className="space-y-4">
      {render.status !== "done" && render.status !== "failed" && (
        <div className="card p-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-white">{render.stage}…</span>
            <span className="text-mist-300">{render.progressPct}%</span>
          </div>
          <ProgressBar pct={render.progressPct} />
          <p className="mt-3 text-xs text-mist-500">
            Rendering via <span className="text-mist-300">{render.videoAdapter}</span> ({render.modelTier} tier) · {render.sceneCount} scenes · async job queue
          </p>
        </div>
      )}

      {render.status === "failed" && (
        <div className="card border-red-500/40 p-6 text-center">
          <p className="mb-3 text-sm text-red-200">Render failed. Your credit was still consumed — try again.</p>
          <Button onClick={() => setRender(null)}>Try again</Button>
        </div>
      )}

      {render.status === "done" && render.output && (
        <>
          <PreviewPlayer output={render.output} />

          {/* Compliance gate — blocking, not advisory */}
          {comp.regulated && (
            <div className={`card p-4 ${comp.passed ? "border-emerald-500/30" : "!border-red-500/60"}`}>
              <div className="mb-2 flex items-center gap-2">
                <Badge tone={comp.passed ? "green" : "red"}>{comp.passed ? "✓ Compliance passed" : "✕ Compliance gate: export blocked"}</Badge>
                <Badge tone="amber">regulated vertical</Badge>
              </div>
              {comp.violations.map((v, i) => (
                <p key={i} className="text-xs text-red-300">✕ "{v.match}" — {v.reason}</p>
              ))}
              {comp.warnings.map((v, i) => (
                <p key={i} className="mt-1 text-xs text-amber-300/90">⚠ {v.match ? `"${v.match}" — ` : ""}{v.reason}</p>
              ))}
              {comp.disclaimer && <p className="mt-2 text-[11px] italic text-mist-500">{comp.disclaimer}</p>}
              {!comp.passed && (
                <Button variant="ghost" className="mt-3" onClick={() => w.setStep("storyboard")}>← Fix the flagged copy in the storyboard</Button>
              )}
            </div>
          )}

          <div className="card flex flex-wrap items-center gap-3 p-4">
            <Button onClick={doExport} disabled={exporting !== null || (comp.regulated && !comp.passed)}>
              {exporting !== null ? `Exporting… ${exporting}%` : `⬇ Export ${render.ratio} video`}
            </Button>
            <Button
              variant="ghost"
              onClick={() => { w.setRender(null); setRender(null); }}
            >
              ↻ Re-render
            </Button>
            <Button variant="ghost" onClick={() => { w.reset(); }}>＋ New ad</Button>
            <span className="ml-auto text-[11px] text-mist-500">
              Saved to Gallery{render.watermark ? " · watermarked (free tier)" : ""} · MVP exports WebM; MP4 lands with the real model adapters
            </span>
          </div>
        </>
      )}
    </div>
  );
}
