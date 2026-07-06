import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useWizard } from "../store";
import type { TrendTemplate, Usage } from "../types";
import { SectionTitle, Spinner } from "../components/ui";
import TrendCard from "../components/TrendCard";

const NICHES = ["all", "supplements", "beauty", "fitness", "study", "gadgets", "finance", "lifestyle"];
const PLATFORMS = ["all", "tiktok", "reels", "shorts"];
const GOALS = ["all", "energy", "focus", "daily-routine", "before-after"];

function FilterRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-mist-500">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${
            value === o ? "bg-ember-500 text-white" : "bg-white/5 text-mist-300 hover:bg-white/10"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function TrendsPage() {
  const [templates, setTemplates] = useState<TrendTemplate[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [niche, setNiche] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [goal, setGoal] = useState("all");
  const navigate = useNavigate();
  const startFromTrend = useWizard((s) => s.startFromTrend);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.trends({ niche, platform, goal }), api.usage()])
      .then(([t, u]) => {
        setTemplates(t.templates);
        setSources(t.sources);
        setUsage(u);
      })
      .finally(() => setLoading(false));
  }, [niche, platform, goal]);

  const locked = usage ? !usage.plan.trendAdaptation : false;

  const makeMyVersion = (t: TrendTemplate) => {
    startFromTrend(t);
    navigate("/create");
  };

  const spiking = templates.find((t) => t.momentum === "peaking");

  return (
    <div>
      <SectionTitle
        title="Trends"
        subtitle="Live format intelligence — what's working right now, distilled into reusable templates. Adapt the format; never copy a creator."
      />

      {spiking && (
        <div className="card mb-5 flex items-center gap-3 border-ember-500/40 p-4">
          <span className="text-2xl">🔔</span>
          <div>
            <div className="text-sm font-bold text-white">Trend alert: "{spiking.name}" is peaking</div>
            <div className="text-xs text-mist-300">High-fit window is open now — momentum {spiking.momentumScore}/100. Daily alerts push when a high-fit format spikes.</div>
          </div>
        </div>
      )}

      <div className="mb-5 space-y-2">
        <FilterRow label="Niche" options={NICHES} value={niche} onChange={setNiche} />
        <FilterRow label="Platform" options={PLATFORMS} value={platform} onChange={setPlatform} />
        <FilterRow label="Goal" options={GOALS} value={goal} onChange={setGoal} />
      </div>

      {loading ? (
        <div className="py-16 text-center"><Spinner label="Loading trend intelligence…" /></div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <TrendCard key={t.id} trend={t} onMakeMyVersion={makeMyVersion} locked={locked} />
            ))}
          </div>
          {templates.length === 0 && <p className="py-10 text-center text-sm text-mist-500">No formats match those filters yet.</p>}
          <p className="mt-6 text-[11px] text-mist-500">
            Sources: {sources.join(" · ")} · clusters refresh daily · formats and structures only — no creator footage, scripts, or audio is reproduced.
            {locked && " · Free tier: trends are view-only in spirit — upgrading unlocks one-tap adaptation presets."}
          </p>
        </>
      )}
    </div>
  );
}
