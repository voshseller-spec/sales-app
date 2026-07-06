import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Usage } from "../types";
import { Badge, Button, SectionTitle, Spinner } from "../components/ui";

export default function ProfilePage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [switching, setSwitching] = useState("");

  const load = () => api.usage().then(setUsage);
  useEffect(() => { load(); }, []);

  if (!usage) return <div className="py-16 text-center"><Spinner label="Loading profile…" /></div>;

  const pct = Math.min((usage.used / usage.limit) * 100, 100);

  const switchPlan = async (id: string) => {
    setSwitching(id);
    try {
      await api.setPlan(id);
      await load();
    } finally {
      setSwitching("");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionTitle title="Profile" subtitle="Plan, usage, and how the platform is wired." />

      {/* Usage meter — caps are enforced server-side; this is informational */}
      <div className="card mb-5 p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-white">Renders this month</span>
          <span className="text-sm text-mist-300">{usage.used} / {usage.limit}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-[width] ${pct >= 100 ? "bg-red-500" : "bg-gradient-to-r from-ember-500 to-gold-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-mist-500">
          Limits are enforced server-side. Credit top-ups cover overage on paid tiers.
        </p>
      </div>

      {/* Plans */}
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {usage.plans.map((p) => {
          const active = p.id === usage.plan.id;
          return (
            <div key={p.id} className={`card flex flex-col p-5 ${active ? "!border-ember-500/60" : ""}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold text-white">{p.label}</span>
                {active && <Badge tone="ember">current</Badge>}
              </div>
              <div className="mb-3 text-2xl font-extrabold text-white">{p.price}</div>
              <ul className="mb-4 space-y-1.5 text-xs text-mist-300">
                {p.perks.map((perk) => <li key={perk}>· {perk}</li>)}
              </ul>
              <Button
                variant={active ? "ghost" : "primary"}
                disabled={active || switching === p.id}
                onClick={() => switchPlan(p.id)}
                className="mt-auto"
              >
                {active ? "Active" : switching === p.id ? "Switching…" : `Switch to ${p.label}`}
              </Button>
            </div>
          );
        })}
      </div>

      <AdapterStatus />

      <div className="card mt-5 p-5 text-xs leading-relaxed text-mist-300">
        <p className="mb-2 font-bold text-white">Guardrails baked in</p>
        <p>· Trend engine adapts formats, structures, and styles — never a specific creator's footage, script, or audio.</p>
        <p>· Final renders use only platform-licensed, royalty-free, or user-supplied audio.</p>
        <p>· Regulated verticals (supplements, health, finance) pass a compliance gate before export.</p>
        <p>· Trend data comes from TOS-safe surfaces: YouTube Data API, TikTok Creative Center, Meta Ad Library API.</p>
      </div>
    </div>
  );
}

function AdapterStatus() {
  const [health, setHealth] = useState<{ adapters: { llm: string; trends: string[]; video: string } } | null>(null);
  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then(setHealth).catch(() => {});
  }, []);
  if (!health) return null;
  const a = health.adapters;
  const mock = (name: string) => name.startsWith("mock");
  return (
    <div className="card p-5">
      <p className="mb-3 text-sm font-bold text-white">Adapters <span className="ml-1 text-[11px] font-normal text-mist-500">every integration is swappable — mocks run with zero keys</span></p>
      <div className="space-y-2 text-xs">
        {[
          ["Script LLM", a.llm],
          ["Trend sources", a.trends.join(", ")],
          ["Video model", a.video],
        ].map(([label, val]) => (
          <div key={label} className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2">
            <span className="text-mist-300">{label}</span>
            <span className="flex items-center gap-2 font-mono text-mist-100">
              {val}
              <Badge tone={mock(String(val)) ? "amber" : "green"}>{mock(String(val)) ? "mock" : "live"}</Badge>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-mist-500">
        Add keys in <code>.env</code> (ANTHROPIC_API_KEY, YOUTUBE_API_KEY, HIGGSFIELD_API_KEY) to flip adapters live — no code changes.
      </p>
    </div>
  );
}
