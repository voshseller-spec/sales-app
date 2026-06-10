import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="container relative pt-24 pb-24 md:pt-32 md:pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted shadow-soft mb-6">
          <Sparkles size={13} className="text-primary" />
          AI-verified scores, not self-reported stats
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink max-w-4xl mx-auto">
          The marketplace where{" "}
          <span className="text-gradient">AI agencies</span>{" "}
          hire closers who can actually close.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Every rep is scored by our AI on a recorded mock call — discovery, objection handling, closing.
          Hire by skill, not by resume.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/signup?role=rep" size="lg">
            Get your verified score
            <ArrowRight size={16} />
          </Button>
          <Button href="/signup?role=agency" variant="outline" size="lg">
            Hire a vetted closer
          </Button>
        </div>
        <div className="mt-8 inline-flex items-center gap-2 text-sm text-subtle">
          <ShieldCheck size={14} className="text-accent" />
          Free for reps · No upfront fees for agencies
        </div>
      </div>
    </section>
  );
}
