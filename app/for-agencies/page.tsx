import { ArrowRight, BadgeCheck, Filter, Gauge, Handshake, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";

export const metadata = { title: "For agencies — Closer" };

const checks = [
  "AI-scored 12-minute mock call against real-world buyer scenarios",
  "Background and reference verification before badge issuance",
  "Sub-scores: discovery, objection handling, closing, talk ratio",
  "Score recency — agencies see when each rep last tested",
  "Two-sided opt-in: reps see your offer before either party reveals contact",
];

export default function ForAgenciesPage() {
  return (
    <>
      <section className="border-b border-border bg-ink text-bg">
        <div className="container py-20 md:py-28 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-bg/15 px-3 py-1 text-xs text-bg/70 mb-6">
            <ShieldCheck size={13} className="text-accent" /> For AI agencies hiring closers and SDRs
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Hire closers who can <span className="text-accent">actually close</span>.
          </h1>
          <p className="mt-5 text-lg text-bg/70 leading-relaxed">
            Stop screening 80 resumes for one good closer. Every rep on Closer is AI-scored on a recorded
            mock call. Browse only verified talent, filter by skill, hire in days — not months.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button href="/signup?role=agency" size="lg">
              See verified closers
              <ArrowRight size={16} />
            </Button>
            <Button href="/pricing" variant="outline" size="lg" className="bg-transparent border-bg/20 text-bg hover:bg-bg/10">
              See pricing
            </Button>
          </div>
        </div>
      </section>

      <FeatureGrid
        title="Built for AI agencies tired of bad hires"
        features={[
          { icon: BadgeCheck, title: "Every rep is verified", body: "No more vibes-based hiring. See the score, hear the call, compare apples to apples." },
          { icon: Filter, title: "Filter by what matters", body: "Search by ticket size, vertical, sub-score, motion (closer / SDR / full-cycle)." },
          { icon: Timer, title: "Hire in 72 hours", body: "Median time from posting a role to first interview is under three days." },
          { icon: Gauge, title: "Replace fit, not pedigree", body: "Score 90+ first-year reps outsell pedigreed 5-year reps. We let you see that." },
          { icon: Handshake, title: "Pay on match, not on intent", body: "No upfront listing fees. You pay when a verified closer signs on with your offer." },
          { icon: ShieldCheck, title: "Trust layer built in", body: "Background checks, written terms, payout reviews. Both sides protected." },
        ]}
      />

      <Section className="bg-surface/40 border-y border-border">
        <SectionHeader
          eyebrow="Trust & vetting"
          title="What 'verified' actually means"
          description="No black box. Here's exactly what we check before a rep gets a badge."
        />
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-elevated p-7 shadow-soft">
          <ul className="space-y-4">
            {checks.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <BadgeCheck size={12} />
                </span>
                <span className="text-ink">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
