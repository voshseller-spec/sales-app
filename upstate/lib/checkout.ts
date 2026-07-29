/**
 * The single buy-flow entry point. Every buy button on the site calls
 * initiateCheckout() and nothing else.
 *
 * Behaviour: asks /api/checkout for a Stripe Checkout session and redirects
 * the customer to Stripe's hosted payment page.
 *
 * If Stripe isn't configured yet (no STRIPE_SECRET_KEY on the server) the API
 * answers 503 and we fall back to the "coming soon" waitlist modal. That means
 * the site is never broken: no key = waitlist, key = real checkout. Nothing
 * here needs changing on launch day — just set the env var.
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

/**
 * The one function buy buttons call. Resolves once the browser has been sent
 * to Stripe, or once the fallback modal is open.
 */
export async function initiateCheckout(): Promise<void> {
  try {
    const res = await fetch("/api/checkout", { method: "POST" });

    if (res.ok) {
      const { url } = (await res.json()) as { url?: string };
      if (url) {
        window.location.assign(url);
        return;
      }
    }
  } catch {
    // Offline or the request failed outright — fall through to the modal.
  }

  // Stripe unconfigured (503), errored, or unreachable: never leave the
  // customer with a dead button.
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
