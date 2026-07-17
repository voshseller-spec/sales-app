"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { registerCheckoutHandler, submitWaitlistEmail } from "@/lib/checkout";

/**
 * "Checkout coming soon" modal. Mounted once at page level; opened via
 * lib/checkout.ts. Uses a native <dialog> for focus handling and Esc-to-close.
 * When Stripe lands this component simply stops being opened — no changes
 * needed here or in any buy button.
 */
export default function CheckoutModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    return registerCheckoutHandler(() => {
      setSubmitted(false);
      dialogRef.current?.showModal();
    });
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    submitWaitlistEmail(email.trim());
    setSubmitted(true);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="checkout-modal-title"
      className="m-auto w-[calc(100vw-2.5rem)] max-w-md border border-graphite bg-carbon p-0 text-steel backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes.
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <div className="p-8 sm:p-10">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-steel">
          <span aria-hidden="true" className="mr-2 text-bolt">
            ⚡
          </span>
          Checkout coming soon
        </p>
        <h2
          id="checkout-modal-title"
          className="font-display text-chrome mb-4 text-2xl uppercase tracking-tight"
        >
          Almost ready
        </h2>

        {submitted ? (
          <p className="text-[15px] leading-relaxed">
            You&apos;re on the list. We&apos;ll email you the moment checkout
            opens — nothing else, ever.
          </p>
        ) : (
          <>
            <p className="mb-6 text-[15px] leading-relaxed">
              Online checkout opens shortly. Leave your email and you&apos;ll
              be first to know.
            </p>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <label
                htmlFor="waitlist-email"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel"
              >
                Email
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-graphite bg-ink px-4 py-3 text-[15px] text-bolt placeholder:text-steel/40"
              />
              <button
                type="submit"
                className="mt-2 cursor-pointer bg-bolt px-8 py-3 font-mono text-sm uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
              >
                Join the list
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute right-4 top-4 cursor-pointer p-2 font-mono text-steel transition-colors hover:text-bolt"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
}
