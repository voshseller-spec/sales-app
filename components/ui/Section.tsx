import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-20 md:py-28", className)} {...props}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("mb-12 md:mb-16 max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">{title}</h2>
      {description && <p className="mt-4 text-muted text-lg leading-relaxed">{description}</p>}
    </div>
  );
}
