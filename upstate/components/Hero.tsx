import Image from "next/image";
import { content, formatNZD } from "@/content";
import BuyButton from "./BuyButton";

function ProductImageSlot() {
  const { imageSrc, imageAlt } = content.product;

  return (
    <div className="relative mx-auto mt-14 w-full max-w-xs sm:max-w-sm">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={640}
          height={960}
          priority
          className="mx-auto h-auto w-full"
          sizes="(max-width: 640px) 80vw, 384px"
        />
      ) : (
        /* Styled empty state — swap content.product.imageSrc to replace. */
        <div
          role="img"
          aria-label={content.product.imageAlt}
          className="mx-auto flex aspect-[2/3] w-full flex-col items-center justify-center gap-3 border border-graphite bg-carbon/60"
        >
          <span aria-hidden="true" className="text-3xl text-bolt">
            ⚡
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-steel">
            Product render
          </span>
          <span className="px-8 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-steel/80">
            set product.imageSrc in content.ts
          </span>
        </div>
      )}
      {/* Reflective floor shadow */}
      <div
        aria-hidden="true"
        className="floor-shadow absolute -bottom-8 left-1/2 h-16 w-[130%] -translate-x-1/2"
      />
    </div>
  );
}

export default function Hero() {
  const { product, hero, brand } = content;

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
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

        <ProductImageSlot />
      </div>
    </section>
  );
}
