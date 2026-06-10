import { Section } from "@/components/ui/Section";
import { SwipeStack } from "@/components/match/SwipeStack";
import { reps } from "@/lib/mock";

export const metadata = { title: "Matches — Closer" };

export default function MatchesPage() {
  return (
    <Section className="py-14 md:py-20">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Today's matches</h1>
        <p className="mt-3 text-muted">
          Swipe through verified closers tailored to your offer. Drag the card, or use the controls.
        </p>
      </div>
      <SwipeStack initial={reps} />
    </Section>
  );
}
