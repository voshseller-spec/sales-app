import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 group", className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-bg overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
        <span className="relative font-mono font-bold text-sm">C</span>
      </span>
      <span className="font-semibold tracking-tight text-ink text-lg">Closer</span>
    </Link>
  );
}
