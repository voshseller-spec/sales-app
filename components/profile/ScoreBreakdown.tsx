import type { ScoreBreakdown as Score } from "@/lib/types";

const dims: { key: keyof Score; label: string; desc: string }[] = [
  { key: "discovery", label: "Discovery", desc: "Question depth, listening, pain identification." },
  { key: "objectionHandling", label: "Objection handling", desc: "Reframe, isolate, resolve — without pressure." },
  { key: "closing", label: "Closing", desc: "Clear next steps, asks for the business, mutual action." },
  { key: "talkRatio", label: "Talk ratio", desc: "Buyer-to-rep speaking balance through the call." },
];

export function ScoreBreakdownPanel({ score }: { score: Score }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {dims.map((d) => {
        const value = score[d.key];
        const tone = value >= 90 ? "bg-accent" : value >= 80 ? "bg-primary" : "bg-warning";
        return (
          <div key={d.key} className="rounded-xl border border-border bg-elevated p-5 shadow-soft">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm font-semibold text-ink">{d.label}</h4>
              <span className="font-mono text-2xl font-semibold text-ink">{value}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{d.desc}</p>
            <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
              <div className={`h-full ${tone}`} style={{ width: `${value}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
