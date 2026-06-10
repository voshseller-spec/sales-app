import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

export const metadata = { title: "Pricing — Closer" };

const tiers = [
  {
    name: "Rep",
    price: "Free",
    detail: "forever",
    tagline: "For closers, SDRs, and ambitious beginners.",
    features: [
      "AI assessment + verified score",
      "Shareable badge for LinkedIn",
      "Browse and apply to all open roles",
      "Two-sided matching with agencies",
      "Community access",
      "Monthly re-score",
    ],
    cta: { label: "Get my score", href: "/signup?role=rep" },
    highlight: false,
  },
  {
    name: "Studio",
    price: "$199",
    detail: "/ month",
    tagline: "Solo agencies and small AI teams hiring their first 1–3 reps.",
    features: [
      "1 active role at a time",
      "Filter by sub-score, vertical, motion",
      "10 swipes/day on verified reps",
      "Standard background checks",
      "Email support",
    ],
    cta: { label: "Start Studio", href: "/signup?role=agency&plan=studio" },
    highlight: false,
  },
  {
    name: "Scale",
    price: "$599",
    detail: "/ month",
    tagline: "Growing agencies hiring closers across multiple offers.",
    features: [
      "Unlimited active roles",
      "Unlimited swipes",
      "Team seats (5 included)",
      "Score-based candidate alerts",
      "Priority support + onboarding",
      "Enhanced background checks",
    ],
    cta: { label: "Start Scale", href: "/signup?role=agency&plan=scale" },
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    detail: "",
    tagline: "Multi-brand operators and agencies hiring 10+ reps a quarter.",
    features: [
      "Custom workflows + SSO",
      "Dedicated hiring partner",
      "Bespoke scoring rubrics",
      "API access for ATS",
      "SOC 2 + DPA",
    ],
    cta: { label: "Talk to sales", href: "#" },
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="container py-20 md:py-24 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-3 py-1 text-xs text-muted shadow-soft mb-6">
            <Sparkles size={13} className="text-primary" /> Reps are free. Agencies pay when it works.
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
            Simple pricing. No surprise success fees.
          </h1>
          <p className="mt-5 text-lg text-muted">
            Flat monthly plans for agencies. No commissions on rep earnings, ever.
          </p>
        </div>
      </section>

      <Section className="py-14 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={cn(
                "rounded-2xl border p-7 flex flex-col",
                t.highlight
                  ? "border-primary bg-primary-soft/40 shadow-glow"
                  : "border-border bg-elevated shadow-soft"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">{t.name}</h3>
                {t.highlight && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-primary text-primary-fg px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-mono text-4xl font-semibold text-ink">{t.price}</span>
                <span className="text-sm text-subtle">{t.detail}</span>
              </div>
              <p className="mt-3 text-sm text-muted">{t.tagline}</p>
              <ul className="mt-6 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink">
                    <Check size={15} className="text-accent mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                href={t.cta.href}
                variant={t.highlight ? "primary" : "outline"}
                className="mt-7"
              >
                {t.cta.label}
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-surface/40 border-y border-border">
        <SectionHeader
          eyebrow="FAQ"
          title="Common questions"
        />
        <div className="max-w-2xl mx-auto space-y-3">
          {[
            ["Is Closer really free for reps?", "Yes. No subscriptions, no listing fees, no commissions on what you earn from a role."],
            ["What happens if a match doesn't work out?", "We review payout disputes both ways. If you parted ways inside the first 14 days, we'll refund the agency and re-list the role at no cost."],
            ["Can I cancel a Scale plan anytime?", "Yes. Monthly plans cancel at the next billing cycle, no penalty, no questions."],
            ["Do you take a cut of rep earnings?", "No. Reps keep 100% of what they earn from agencies they match with."],
          ].map(([q, a]) => (
            <details key={q} className="rounded-xl border border-border bg-elevated p-5">
              <summary className="cursor-pointer font-medium text-ink">{q}</summary>
              <p className="mt-3 text-muted">{a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
