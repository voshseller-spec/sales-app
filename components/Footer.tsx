import { content } from "@/content";

export default function Footer() {
  const { brand, footer } = content;

  return (
    <footer className="border-t border-graphite bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="font-display text-base uppercase tracking-tight text-bolt">
            {brand.name}
          </span>
          <a
            href={`mailto:${brand.contactEmail}`}
            className="font-mono text-xs uppercase tracking-[0.2em] text-steel transition-colors hover:text-bolt"
          >
            {brand.contactEmail}
          </a>
        </div>
        <p className="max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel/80">
          {footer.disclaimer}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-steel/80">
          © {new Date().getFullYear()} {footer.copyrightName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
