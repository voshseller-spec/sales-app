import { content } from "@/content";
import FadeUp from "./FadeUp";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const { eyebrow, heading, items } = content.faq;

  return (
    <section className="border-t border-graphite bg-carbon">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <FadeUp>
          <SectionHeading eyebrow={eyebrow} heading={heading} />
        </FadeUp>
        <FadeUp>
          <div className="max-w-3xl border-t border-graphite">
            {items.map((item) => (
              <details key={item.q} className="group border-b border-graphite">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium text-bolt transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="select-none font-mono text-steel transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-[15px] leading-relaxed text-steel">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
