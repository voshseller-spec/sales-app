import { ArrowRight, BadgeCheck, Banknote, Gauge, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { ScoreBreakdownPanel } from "@/components/profile/ScoreBreakdown";
import { sampleScore } from "@/lib/mock";

export const metadata = { title: "For reps — Closer" };

export default function ForRepsPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="container py-20 md:py-28 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted shadow-soft mb-6">
            <Sparkles size={13} className="text-primary" /> For closers, SDRs, and ambitious beginners
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
            A resume can't show how you sell. Your score can.
          </h1>
          <p className="mt-5 text-lg text-muted leading-relaxed">
            Closer is free for reps. Take a 12-minute AI mock call, get a verified score with sub-scores
            for discovery, objections, closing, and talk ratio. Then match with AI agencies hiring right now.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button href="/signup?role=rep" size="lg">
              Get my score — free
              <ArrowRight size={16} />
            </Button>
            <Button href="/assessment" variant="outline" size="lg">
              See how scoring works
            </Button>
          </div>
        </div>
      </section>

      <FeatureGrid
        title="Built for reps who are tired of the resume game"
        features={[
          { icon: Banknote, title: "Free forever for reps", body: "We charge agencies, not you. No subscriptions, no listing fees." },
          { icon: BadgeCheck, title: "A score that travels", body: "Drop your badge on LinkedIn, your portfolio, your DMs. Credibility on demand." },
          { icon: Gauge, title: "Skill-first matching", body: "Agencies filter you by sub-score and vertical — you show up for the right calls." },
          { icon: GraduationCap, title: "Capable beginner? Welcome.", body: "First-year closers with 85+ scores beat out 5-year reps every day on Closer." },
          { icon: ShieldCheck, title: "Real offers, real pay", body: "Verified agencies. Verified terms. Pay-out reviews if anything goes sideways." },
          { icon: Sparkles, title: "Re-score anytime", body: "Improving? Re-take the assessment monthly. Your latest score is the one that shows." },
        ]}
      />

      <Section className="bg-surface/40 border-y border-border">
        <SectionHeader
          eyebrow="What your score looks like"
          title="A breakdown that tells the truth"
          description="No five-star reviews from your buddy. No 'top 1% closer' self-tag. Just signal."
        />
        <div className="max-w-3xl mx-auto">
          <ScoreBreakdownPanel score={sampleScore} />
        </div>
      </Section>
    </>
  );
}
