/**
 * The single buy-flow entry point. Every buy button on the site calls
 * initiateCheckout() and nothing else — when Stripe arrives, this is the
 * ONLY file that changes.
 *
 * Current behaviour: opens the "Checkout coming soon" modal (email capture).
 * Future behaviour (Stripe): replace the body of initiateCheckout() with a
 * redirect to a Stripe Checkout session, e.g.
 *
 *   export async function initiateCheckout() {
 *     const res = await fetch("/api/checkout", { method: "POST" });
 *     const { url } = await res.json();
 *     window.location.assign(url); // Stripe-hosted checkout
 *   }
 *
 * The buy buttons are already async-safe, so the swap is drop-in.
 */

type CheckoutHandler = () => void;

let openModal: CheckoutHandler | null = null;

/** Called by <CheckoutModal> on mount; not used anywhere else. */
export function registerCheckoutHandler(handler: CheckoutHandler): () => void {
  openModal = handler;
  return () => {
    if (openModal === handler) openModal = null;
  };
}

/** The one function buy buttons call. */
export function initiateCheckout(): void {
  // TODO(stripe): replace this with a Stripe Checkout redirect (see header comment).
  openModal?.();
}

const WAITLIST_KEY = "upstate.waitlist";

/** Stores a waitlist signup locally until an email provider is wired up. */
export function submitWaitlistEmail(email: string): void {
  // TODO: wire to email provider (Resend / Mailchimp / etc.)
  try {
    const existing: string[] = JSON.parse(
      localStorage.getItem(WAITLIST_KEY) ?? "[]"
    );
    if (!existing.includes(email)) existing.push(email);
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(existing));
  } catch {
    // localStorage unavailable (private mode etc.) — still log below.
  }
  console.log("[upstate] waitlist signup:", email);
}
