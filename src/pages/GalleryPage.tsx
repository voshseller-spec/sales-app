import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Render } from "../types";
import { Badge, Button, SectionTitle, Spinner, ProgressBar } from "../components/ui";
import PreviewPlayer from "../components/PreviewPlayer";

function PerformanceForm({ render, onSaved }: { render: Render; onSaved: () => void }) {
  const [form, setForm] = useState({
    views: render.performance?.views?.toString() || "",
    ctr: render.performance?.ctr?.toString() || "",
    spend: render.performance?.spend?.toString() || "",
    notes: render.performance?.notes || "",
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await api.logPerformance(render.id, {
        views: Number(form.views) || 0,
        ctr: Number(form.ctr) || 0,
        spend: Number(form.spend) || 0,
        notes: form.notes,
      });
      onSaved();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 rounded-xl bg-black/30 p-3">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-mist-500">
        Performance log — feeds your trend ranking
      </p>
      <div className="grid grid-cols-3 gap-2">
        <input className="input !py-1.5 text-xs" placeholder="Views" inputMode="numeric" value={form.views} onChange={(e) => setForm({ ...form, views: e.target.value })} />
        <input className="input !py-1.5 text-xs" placeholder="CTR %" inputMode="decimal" value={form.ctr} onChange={(e) => setForm({ ...form, ctr: e.target.value })} />
        <input className="input !py-1.5 text-xs" placeholder="Spend $" inputMode="decimal" value={form.spend} onChange={(e) => setForm({ ...form, spend: e.target.value })} />
      </div>
      <div className="mt-2 flex gap-2">
        <input className="input !py-1.5 text-xs" placeholder="Notes (what worked?)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <Button className="!py-1.5 text-xs" onClick={save} disabled={busy}>{busy ? "…" : "Log"}</Button>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [renders, setRenders] = useState<Render[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () => api.listRenders().then((r) => setRenders(r.renders));
  useEffect(() => {
    load();
    const anyActive = () => renders?.some((r) => r.status === "queued" || r.status === "rendering");
    const iv = setInterval(() => { if (anyActive() !== false) load(); }, 2500);
    return () => clearInterval(iv);
  }, []);

  if (!renders) return <div className="py-16 text-center"><Spinner label="Loading gallery…" /></div>;

  return (
    <div>
      <SectionTitle title="Gallery" subtitle="Every render, with the trend it rode and space to log how it actually performed." />

      {renders.length === 0 && (
        <div className="card p-10 text-center text-sm text-mist-300">
          No renders yet. Head to <span className="font-semibold text-ember-400">Create</span> and make your first UGC ad.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {renders.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-bold text-white">{r.product.name}</span>
              <Badge tone={r.status === "done" ? "green" : r.status === "failed" ? "red" : "amber"}>{r.status}</Badge>
              {r.watermark && <Badge>watermark</Badge>}
              <Badge>{r.ratio}</Badge>
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5 text-[11px] text-mist-500">
              {r.trendTemplateName && <Badge tone="ember">⚡ {r.trendTemplateName}</Badge>}
              <span>model: {r.videoAdapter} ({r.modelTier})</span>
              <span>· {r.sceneCount} scenes</span>
              <span>· {r.costCredits} credits</span>
              <span>· {new Date(r.createdAt).toLocaleString()}</span>
            </div>

            {(r.status === "queued" || r.status === "rendering") && (
              <div className="my-3">
                <ProgressBar pct={r.progressPct} />
                <p className="mt-1 text-xs text-mist-500">{r.stage}… {r.progressPct}%</p>
              </div>
            )}

            {r.compliance?.regulated && (
              <p className={`mb-2 text-xs ${r.compliance.passed ? "text-emerald-300" : "text-red-300"}`}>
                {r.compliance.passed ? "✓ compliance passed" : "✕ compliance gate: fix copy before running as an ad"}
              </p>
            )}

            {r.performance ? (
              <p className="text-xs text-mist-300">
                📊 {r.performance.views.toLocaleString()} views · {r.performance.ctr}% CTR · ${r.performance.spend} spend
                {r.performance.notes && <> · "{r.performance.notes}"</>}
              </p>
            ) : null}

            {r.status === "done" && r.output && (
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" className="!py-1.5 text-xs" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                  {openId === r.id ? "Hide preview" : "▶ Preview"}
                </Button>
              </div>
            )}
            {openId === r.id && r.output && (
              <div className="mt-3"><PreviewPlayer output={r.output} /></div>
            )}

            {r.status === "done" && <PerformanceForm render={r} onSaved={load} />}
          </div>
        ))}
      </div>
    </div>
  );
}
