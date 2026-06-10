import { Mic, Sparkles, Handshake } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const steps = [
  {
    icon: Mic,
    title: "Record a 12-minute mock call",
    body: "Pitch our AI buyer on a real-world scenario. No script. We grade you exactly how you sell.",
  },
  {
    icon: Sparkles,
    title: "Get your verified Closer Score",
    body: "Four sub-scores — discovery, objections, closing, talk-ratio — plus a shareable badge.",
  },
  {
    icon: Handshake,
    title: "Match with the right agency",
    body: "Swipe through pre-vetted AI agencies (or closers). Both sides accept, you take the call.",
  },
];

export function HowItWorks() {
  return (
    <Section>
      <SectionHeader
        eyebrow="How it works"
        title="From verified to hired in 72 hours"
        description="No more 'send me your resume.' Show the work, get matched, start closing."
      />
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-xl border border-border bg-elevated p-7 shadow-soft"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary mb-5">
              <s.icon size={18} />
            </div>
            <div className="text-xs font-mono text-subtle mb-2">
              0{i + 1}
            </div>
            <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
