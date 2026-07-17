type Props = {
  eyebrow: string;
  heading: string;
  id?: string;
};

export default function SectionHeading({ eyebrow, heading, id }: Props) {
  return (
    <div id={id} className="mb-12 scroll-mt-24">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-steel">
        {eyebrow}
      </p>
      <h2 className="font-display text-chrome max-w-3xl text-3xl uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {heading}
      </h2>
    </div>
  );
}
