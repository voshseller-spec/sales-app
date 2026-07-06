import type { ReactNode, ButtonHTMLAttributes } from "react";
import type { Momentum } from "../types";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";
  const styles = {
    primary: "bg-ember-500 hover:bg-ember-600 text-white",
    ghost: "border border-mist-500/30 text-mist-100 hover:border-ember-500/60 hover:text-white bg-transparent",
    danger: "bg-red-900/60 border border-red-500/40 text-red-200 hover:bg-red-900",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ember" | "green" | "amber" | "red" }) {
  const tones = {
    neutral: "bg-white/5 text-mist-300 border-white/10",
    ember: "bg-ember-500/15 text-ember-400 border-ember-500/30",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    red: "bg-red-500/10 text-red-300 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function MomentumBadge({ momentum }: { momentum: Momentum }) {
  const map: Record<Momentum, { tone: "green" | "ember" | "amber"; icon: string; label: string }> = {
    rising: { tone: "green", icon: "↗", label: "Rising" },
    peaking: { tone: "ember", icon: "◆", label: "Peaking" },
    cooling: { tone: "amber", icon: "↘", label: "Cooling" },
  };
  const m = map[momentum];
  return (
    <Badge tone={m.tone}>
      {m.icon} {m.label}
    </Badge>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-mist-300">{subtitle}</p>}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-mist-300">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ember-500 border-t-transparent" />
      {label}
    </span>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-ember-500 to-gold-400 transition-[width] duration-500"
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}
