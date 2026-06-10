import { Section } from "@/components/ui/Section";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { reps } from "@/lib/mock";

const quotes = [
  {
    body: "Hired our first closer through Closer on a Tuesday — she booked her first $7k retainer that Friday.",
    rep: reps[4],
    role: "Co-founder, Loophole AI",
  },
  {
    body: "The score got me past the resume filter at three agencies I'd been ghosted by. Two weeks later I had offers from all three.",
    rep: reps[2],
    role: "First-year closer",
  },
  {
    body: "Finally, a way to evaluate sales talent that isn't a vibe check. The sub-scores tell me exactly who to call back.",
    rep: reps[3],
    role: "Head of Sales, Northwall.ai",
  },
];

const stats = [
  { kpi: "12,400+", label: "Verified reps" },
  { kpi: "640", label: "AI agencies hiring" },
  { kpi: "$38M", label: "Pipeline closed by reps in 2026" },
  { kpi: "72h", label: "Median time-to-first-match" },
];

export function SocialProof() {
  return (
    <Section className="bg-surface/40 border-y border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="font-mono text-3xl md:text-4xl font-semibold text-ink tracking-tight">
              {s.kpi}
            </div>
            <div className="mt-1.5 text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {quotes.map((q) => (
          <figure
            key={q.rep.id}
            className="rounded-xl border border-border bg-elevated p-7 shadow-soft flex flex-col"
          >
            <blockquote className="text-ink leading-relaxed flex-1">"{q.body}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
              <Avatar src={q.rep.avatar} name={q.rep.name} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink truncate">{q.rep.name}</div>
                <div className="text-xs text-subtle truncate">{q.role}</div>
              </div>
              <VerifiedBadge score={q.rep.score.overall} size="sm" />
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
