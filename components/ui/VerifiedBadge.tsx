import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function VerifiedBadge({
  score,
  className,
  size = "md",
}: {
  score?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-6 text-[11px] px-2 gap-1",
    md: "h-7 text-xs px-2.5 gap-1.5",
    lg: "h-9 text-sm px-3 gap-2",
  } as const;
  const icon = { sm: 12, md: 14, lg: 16 } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-accent-soft border border-accent/30 text-accent font-semibold",
        sizes[size],
        className
      )}
      title="AI-verified skill score"
    >
      <ShieldCheck size={icon[size]} strokeWidth={2.4} />
      Verified{score !== undefined && <span className="font-mono">{score}</span>}
    </span>
  );
}
