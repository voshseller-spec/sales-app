import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-elevated p-10 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
              For reps
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
              Stop sending resumes into the void.
            </h3>
            <p className="mt-3 text-muted leading-relaxed">
              Free to join. Get scored in 12 minutes. Match with AI agencies actively hiring.
            </p>
            <Button href="/signup?role=rep" className="mt-7">
              Get my score — free
              <ArrowRight size={16} />
            </Button>
          </div>
          <div className="rounded-2xl bg-ink text-bg p-10 shadow-lift">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-3">
              For agencies
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Hire a closer who can actually sell your offer.
            </h3>
            <p className="mt-3 text-bg/70 leading-relaxed">
              Browse only AI-verified talent. Filter by skill, vertical, ticket size. Pay when you match.
            </p>
            <Button href="/signup?role=agency" variant="primary" className="mt-7">
              See verified closers
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
