import { content } from "@/content";

export default function SpecStrip() {
  return (
    <section
      aria-label="Product specifications"
      className="border-y border-graphite bg-carbon"
    >
      <ul className="mx-auto flex max-w-6xl flex-col sm:flex-row sm:flex-wrap sm:justify-center">
        {content.specStrip.map((spec) => (
          <li
            key={spec}
            className="flex items-center justify-center border-b border-graphite px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-bolt last:border-b-0 sm:border-b-0 sm:border-r sm:py-5 sm:last:border-r-0"
          >
            {spec}
          </li>
        ))}
      </ul>
    </section>
  );
}
