"use client";

import { initiateCheckout } from "@/lib/checkout";

type Props = {
  label: string;
  variant?: "solid" | "ghost";
  className?: string;
};

/**
 * The only way to buy on this site. Always routes through initiateCheckout()
 * so the Stripe swap later touches lib/checkout.ts and nothing else.
 */
export default function BuyButton({
  label,
  variant = "solid",
  className = "",
}: Props) {
  const base =
    "inline-flex items-center justify-center px-8 py-3.5 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-200 cursor-pointer";
  const styles =
    variant === "solid"
      ? "bg-bolt text-ink hover:bg-white"
      : "border border-graphite text-bolt hover:bg-bolt hover:text-ink hover:border-bolt";

  return (
    <button
      type="button"
      onClick={() => initiateCheckout()}
      className={`${base} ${styles} ${className}`}
    >
      {label}
    </button>
  );
}
