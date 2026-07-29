import { content } from "@/content";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function WhyPills() {
  const { eyebrow, heading, blocks } = content.whyPills;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <SectionHeading id="inside" eyebrow={eyebrow} heading={heading} />
      </Reveal>
      {/* RevealGroup *is* the grid — wrapping the grid in an extra element
          would break the gap-px hairline dividers between the cards. */}
      <RevealGroup className="grid gap-px overflow-hidden border border-graphite bg-graphite md:grid-cols-3">
        {blocks.map((block, i) => (
          <RevealItem key={block.title} className="bg-carbon">
            <div className="flex h-full flex-col gap-4 p-8 sm:p-10">
              <span className="font-mono text-[11px] tracking-[0.25em] text-steel/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-medium text-bolt">{block.title}</h3>
              <p className="text-[15px] leading-relaxed text-steel">
                {block.body}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
