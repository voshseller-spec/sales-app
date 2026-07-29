"use client";

import { useState } from "react";
import { initiateCheckout } from "@/lib/checkout";

type Props = {
  label: string;
  variant?: "solid" | "ghost";
  className?: string;
};

/**
 * The only way to buy on this site. Always routes through initiateCheckout()
 * so the buy flow lives in lib/checkout.ts and nothing else.
 */
export default function BuyButton({
  label,
  variant = "solid",
  className = "",
}: Props) {
  const [pending, setPending] = useState(false);

  async function onClick() {
    // Creating a Stripe session is a network round-trip; block repeat clicks
    // so one impatient customer doesn't open two checkouts.
    if (pending) return;
    setPending(true);
    try {
      await initiateCheckout();
    } finally {
      // On success the browser is already navigating to Stripe; this only
      // matters when we fell back to the modal.
      setPending(false);
    }
  }

  const base =
    "inline-flex items-center justify-center px-8 py-3.5 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-200 cursor-pointer disabled:cursor-wait disabled:opacity-70";
  const styles =
    variant === "solid"
      ? "bg-bolt text-ink hover:bg-white"
      : "border border-graphite text-bolt hover:bg-bolt hover:text-ink hover:border-bolt";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-busy={pending}
      className={`${base} ${styles} ${className}`}
    >
      {pending ? "One moment…" : label}
    </button>
  );
}
