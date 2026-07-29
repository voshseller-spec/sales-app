import Image from "next/image";
import { content, formatNZD } from "@/content";
import BuyButton from "./BuyButton";

export default function Hero() {
  const { product, hero, brand } = content;

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden bg-ink pt-24 text-center sm:pt-28"
    >
      {/*
        The photo is 16:9 with the tin sitting centre-low, while the hero is a
        tall viewport box. Full-bleed cover across the whole section put the
        headline and buy button straight over the tin, so copy gets its own
        band on ink and the photo bleeds across the bottom. The brief is that
        the tin stays completely uncovered — this is what guarantees it at
        every width, rather than hoping a crop behaves.
      */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-steel">
          <span aria-hidden="true" className="mr-2 text-bolt">
            ⚡
          </span>
          Caffeine {product.caffeineMgPerCapsule}mg
        </p>

        <h1 className="font-display chrome-sheen mx-auto select-none text-[clamp(3.4rem,14vw,11rem)] uppercase leading-[0.9] tracking-[-0.02em]">
          {brand.name}
        </h1>

        <p className="mt-5 font-mono text-sm uppercase tracking-[0.55em] text-steel sm:text-base sm:tracking-[0.7em]">
          {brand.tagline}
        </p>

        <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-steel">
          {hero.positioning}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <BuyButton
            label={`${hero.primaryCta} — ${formatNZD(product.priceNZD)} ${product.currency}`}
          />
          <a
            href="#inside"
            className="font-mono text-xs uppercase tracking-[0.2em] text-steel transition-colors hover:text-bolt"
          >
            {hero.secondaryCta}
          </a>
        </div>
      </div>

      {/* Photo band, pinned to the bottom of the hero and bleeding edge to
          edge. mt-auto absorbs any leftover height on tall viewports. */}
      <div className="relative mt-auto h-[46svh] w-full">
        <Image
          src={hero.imageSrc}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          /* Biased low so the tin stays in frame on ultra-wide viewports,
             where this box is the only place the crop bites vertically. */
          className="object-cover object-[center_75%]"
        />
        {/* Feathers the top edge into the ink above, so the photo emerges from
            the background instead of starting on a hard line. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink to-transparent"
        />
      </div>
    </section>
  );
}
