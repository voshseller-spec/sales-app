import { ArrowRight, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ScoreBreakdownPanel } from "@/components/profile/ScoreBreakdown";
import { reps, sampleScore } from "@/lib/mock";

export const metadata = { title: "AI Assessment — Closer" };

const phases = [
  { title: "Discovery", desc: "We open with a realistic ICP buyer who has a real pain. You qualify." },
  { title: "Demo", desc: "You pitch. We push back, ask edge-case questions, look for mid-pitch breaks." },
  { title: "Objections", desc: "Price. Timing. Competitor. 'Send me the deck.' We score how you reframe." },
  { title: "Close", desc: "We see whether you actually ask for the business and set a real next step." },
];

export default function AssessmentPage() {
  const showcase = reps[3];

  return (
    <>
      <section className="border-b border-border">
        <div className="container py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted shadow-soft mb-6">
              <Sparkles size={13} className="text-primary" /> The Closer Score
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
              A 12-minute call. <br />
              A score you can prove.
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              Our AI runs a realistic buyer scenario — discovery, demo, objections, and close — and grades
              you on the dimensions that move pipeline. The output is a verified score and a badge
              agencies actually trust.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button href="/signup?role=rep" size="lg">
                Take the assessment
                <ArrowRight size={16} />
              </Button>
              <Button href="#breakdown" variant="outline" size="lg">
                See a sample score
              </Button>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-subtle">
              <ShieldCheck size={14} className="text-accent" />
              No editing. No re-takes. One shot, just like a real call.
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-elevated p-8 shadow-lift relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
            <div className="relative flex flex-col items-center text-center">
              <ScoreRing value={showcase.score.overall} size={160} label="Closer Score" />
              <VerifiedBadge score={showcase.score.overall} size="lg" className="mt-5" />
              <div className="mt-4 text-sm text-muted">
                Top 4% globally · Recorded 18 days ago
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 w-full font-mono text-xs">
                {Object.entries(showcase.score)
                  .filter(([k]) => k !== "overall")
                  .map(([k, v]) => (
                    <div key={k} className="rounded-md bg-surface/60 border border-border p-3 flex items-center justify-between">
                      <span className="capitalize text-muted">{k.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-ink">{v as number}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader
          eyebrow="What's on the call"
          title="A real sales cycle, in 12 minutes"
          description="The same shape as a 45-minute discovery + demo, compressed and judged on substance."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((p, i) => (
            <div key={p.title} className="rounded-xl border border-border bg-elevated p-6 shadow-soft">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary mb-4">
                <Mic size={15} />
              </div>
              <div className="text-xs font-mono text-subtle mb-1">PHASE 0{i + 1}</div>
              <h3 className="text-base font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="breakdown" className="bg-surface/40 border-y border-border">
        <SectionHeader
          eyebrow="Sample score"
          title="The breakdown agencies see"
          description="No black box. Each dimension shown with a sub-score and exact reasoning."
        />
        <div className="max-w-3xl mx-auto">
          <ScoreBreakdownPanel score={sampleScore} />
        </div>
      </Section>
    </>
  );
}
