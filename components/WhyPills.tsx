import { content } from "@/content";
import FadeUp from "./FadeUp";
import SectionHeading from "./SectionHeading";

export default function WhyPills() {
  const { eyebrow, heading, blocks } = content.whyPills;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <FadeUp>
        <SectionHeading id="inside" eyebrow={eyebrow} heading={heading} />
      </FadeUp>
      <div className="grid gap-px overflow-hidden border border-graphite bg-graphite md:grid-cols-3">
        {blocks.map((block, i) => (
          <FadeUp key={block.title} className="bg-carbon">
            <div className="flex h-full flex-col gap-4 p-8 sm:p-10">
              <span className="font-mono text-[11px] tracking-[0.25em] text-steel/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-medium text-bolt">{block.title}</h3>
              <p className="text-[15px] leading-relaxed text-steel">
                {block.body}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
