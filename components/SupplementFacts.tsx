import { content } from "@/content";
import FadeUp from "./FadeUp";
import SectionHeading from "./SectionHeading";

export default function SupplementFacts() {
  const facts = content.supplementFacts;

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <FadeUp>
        <SectionHeading eyebrow={facts.eyebrow} heading="What's in the bottle" />
      </FadeUp>
      <FadeUp>
        <div className="mx-auto max-w-xl border border-graphite bg-carbon p-6 font-mono sm:p-10">
          <h3 className="border-b-8 border-bolt pb-2 text-2xl font-bold uppercase tracking-tight text-bolt">
            Supplement Facts
          </h3>
          <dl className="flex flex-col gap-1 border-b-4 border-bolt py-2 text-xs uppercase tracking-[0.08em] text-bolt sm:flex-row sm:justify-between sm:gap-4">
            <div className="flex justify-between gap-4 sm:block">
              <dt className="inline text-steel">Serving size&nbsp;</dt>
              <dd className="inline">{facts.servingSize}</dd>
            </div>
            <div className="flex justify-between gap-4 sm:block">
              <dt className="inline text-steel">Servings per container&nbsp;</dt>
              <dd className="inline">{facts.servingsPerContainer}</dd>
            </div>
          </dl>
          <table className="w-full border-collapse text-xs uppercase tracking-[0.08em]">
            <thead>
              <tr className="border-b border-graphite text-left text-steel">
                <th scope="col" className="py-2 font-normal">
                  Amount per serving
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  &nbsp;
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  % DV
                </th>
              </tr>
            </thead>
            <tbody>
              {facts.rows.map((row) => (
                <tr key={row.label} className="border-b border-graphite text-bolt">
                  <th scope="row" className="py-2.5 text-left font-bold">
                    {row.label}
                  </th>
                  <td className="py-2.5 text-right">{row.amount}</td>
                  <td className="py-2.5 text-right">{row.dailyValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[11px] normal-case leading-relaxed text-steel">
            {facts.footnote}
          </p>
          <p className="mt-4 text-[11px] normal-case leading-relaxed text-steel">
            <span className="font-bold text-bolt">Other ingredients: </span>
            {facts.otherIngredients}.
          </p>
        </div>
      </FadeUp>
    </section>
  );
}
