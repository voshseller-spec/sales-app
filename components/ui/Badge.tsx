import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "primary" | "accent" | "danger" | "warning";

const tones: Record<Tone, string> = {
  neutral: "bg-surface text-muted border-border",
  primary: "bg-primary-soft text-primary border-primary/15",
  accent: "bg-accent-soft text-accent border-accent/20",
  danger: "bg-danger-soft text-danger border-danger/20",
  warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: { tone?: Tone } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
