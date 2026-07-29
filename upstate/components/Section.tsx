import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The page's two section shells, so a new or pasted section inherits the
 * container width, gutters and vertical rhythm instead of inventing its own.
 *
 *   surface="ink"    — transparent band on the page background (WhyPills, ValueMath)
 *   surface="carbon" — raised band with hairline rules top and bottom (Dosing, FAQ)
 *
 * Existing sections still inline these classes; this is for what comes next.
 * Both variants are the same box, so alternating surfaces keeps the rhythm.
 */
type Props = {
  children: ReactNode;
  surface?: "ink" | "carbon";
  /** Anchor target for in-page nav links. Gets scroll-mt for the fixed header. */
  id?: string;
  /** Extra classes on the inner container. Additive only — see lib/cn.ts. */
  className?: string;
  "aria-label"?: string;
};

const INNER = "mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32";

export default function Section({
  children,
  surface = "ink",
  id,
  className,
  "aria-label": ariaLabel,
}: Props) {
  if (surface === "carbon") {
    return (
      <section
        id={id}
        aria-label={ariaLabel}
        className={cn("border-y border-graphite bg-carbon", id && "scroll-mt-24")}
      >
        <div className={cn(INNER, className)}>{children}</div>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(INNER, id && "scroll-mt-24", className)}
    >
      {children}
    </section>
  );
}
