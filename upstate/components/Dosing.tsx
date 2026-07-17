import { content } from "@/content";
import FadeUp from "./FadeUp";
import SectionHeading from "./SectionHeading";

export default function Dosing() {
  const { eyebrow, heading, guidance, disclaimer } = content.dosing;

  return (
    <section className="border-y border-graphite bg-carbon">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <FadeUp>
          <SectionHeading eyebrow={eyebrow} heading={heading} />
        </FadeUp>
        <FadeUp>
          <ul className="max-w-2xl space-y-5">
            {guidance.map((line) => (
              <li key={line} className="flex gap-4 text-[15px] leading-relaxed">
                <span aria-hidden="true" className="mt-0.5 select-none text-bolt">
                  ⚡
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl border-t border-graphite pt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-steel/80">
            {disclaimer}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
