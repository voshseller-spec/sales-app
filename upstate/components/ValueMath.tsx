import { content, formatNZD, perServingNZD } from "@/content";
import FadeUp from "./FadeUp";
import SectionHeading from "./SectionHeading";

export default function ValueMath() {
  const { eyebrow, heading, comparisons, note, upstateLabel, unitLabel } =
    content.valueMath;
  const perServing = perServingNZD();

  const columns = [
    { label: upstateLabel, price: perServing, hero: true },
    ...comparisons.map((c) => ({ label: c.label, price: c.priceNZD, hero: false })),
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <FadeUp>
        <SectionHeading eyebrow={eyebrow} heading={heading} />
      </FadeUp>
      <FadeUp>
        {/* A description list, not a stack of spans: it ties each price to its
            label for screen readers. Tailwind preflight zeroes the default dd
            indent, so this is visually identical to the previous markup. */}
        <dl className="grid gap-px overflow-hidden border border-graphite bg-graphite sm:grid-cols-3">
          {columns.map((col) => (
            <div
              key={col.label}
              className="flex flex-col items-center gap-3 bg-carbon px-6 py-12 text-center"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-steel">
                {col.label}
              </dt>
              <dd
                className={
                  col.hero
                    ? "font-display text-chrome text-5xl tracking-tight sm:text-6xl"
                    : "font-display text-4xl tracking-tight text-steel/60 sm:text-5xl"
                }
              >
                {formatNZD(col.price, { cents: true })}
              </dd>
              <dd className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel/80">
                {unitLabel}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-steel/80">
          {note}
        </p>
      </FadeUp>
    </section>
  );
}
