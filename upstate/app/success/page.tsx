import Link from "next/link";
import type { Metadata } from "next";
import Stripe from "stripe";
import { content } from "@/content";

export const metadata: Metadata = {
  title: "Order confirmed — Upstate",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

/**
 * Where Stripe sends customers after a successful payment. Looks the order up
 * server-side so the confirmation reflects a real, paid session rather than
 * trusting whatever landed in the URL.
 */
export default async function SuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  let customerEmail: string | null = null;
  let paid = false;

  if (sessionId && secretKey) {
    try {
      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      customerEmail = session.customer_details?.email ?? null;
    } catch (error) {
      console.error("[upstate] Could not retrieve checkout session:", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 py-24 text-center sm:px-8">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-steel">
        <span aria-hidden="true" className="mr-2 text-bolt">
          ⚡
        </span>
        {paid ? "Payment received" : "Thank you"}
      </p>

      <h1 className="font-display text-chrome mb-6 text-4xl uppercase leading-none tracking-tight sm:text-6xl">
        {paid ? "You're sorted" : "Order received"}
      </h1>

      <p className="max-w-md text-[15px] leading-relaxed text-steel">
        {paid ? (
          <>
            Your {content.product.name} is on its way — NZ-wide shipping, no
            signature needed.
            {customerEmail ? (
              <>
                {" "}
                A receipt is headed to{" "}
                <span className="text-bolt">{customerEmail}</span>.
              </>
            ) : null}
          </>
        ) : (
          <>
            If your payment went through you&apos;ll have a receipt by email
            shortly. Nothing yet? Get in touch and we&apos;ll track it down.
          </>
        )}
      </p>

      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-steel/70">
        Questions —{" "}
        <a
          href={`mailto:${content.brand.contactEmail}`}
          className="text-bolt underline underline-offset-4"
        >
          {content.brand.contactEmail}
        </a>
      </p>

      <Link
        href="/"
        className="mt-12 inline-flex items-center justify-center border border-graphite px-8 py-3.5 font-mono text-sm uppercase tracking-[0.2em] text-bolt transition-colors duration-200 hover:border-bolt hover:bg-bolt hover:text-ink"
      >
        Back to site
      </Link>
    </main>
  );
}
