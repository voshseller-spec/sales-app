import { content, formatNZD } from "@/content";
import BuyButton from "./BuyButton";
import FadeUp from "./FadeUp";

export default function FinalCTA() {
  const { finalCta, product } = content;

  return (
    <section className="border-t border-graphite bg-ink">
      <FadeUp>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-28 text-center sm:px-8 sm:py-40">
          <h2 className="font-display text-chrome text-4xl uppercase leading-none tracking-tight sm:text-6xl md:text-7xl">
            {finalCta.heading}
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">
            {finalCta.subline}
          </p>
          <BuyButton
            label={`${finalCta.button} — ${formatNZD(product.priceNZD)} ${product.currency}`}
          />
        </div>
      </FadeUp>
    </section>
  );
}
