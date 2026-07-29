import Stripe from "stripe";
import { content } from "@/content";

/**
 * Creates a Stripe Checkout session and hands the URL back to the client,
 * which redirects to Stripe's hosted payment page. Card details never touch
 * this site.
 *
 * Requires STRIPE_SECRET_KEY. Without it this returns 503 and the buy buttons
 * fall back to the "coming soon" waitlist modal — so the site stays functional
 * before Stripe is set up.
 */

/** NZD dollars -> integer cents, which is what Stripe expects. */
function toCents(nzd: number): number {
  return Math.round(nzd * 100);
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return Response.json(
      { error: "stripe_not_configured" },
      { status: 503 }
    );
  }

  // Prefer an explicit site URL; otherwise derive it from the request itself.
  // Deliberately not the `origin` header, which the caller controls.
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    new URL(request.url).origin;

  const { product, checkout } = content;
  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "nzd",
            unit_amount: toCents(product.priceNZD),
            product_data: {
              name: `${product.name} — ${product.capsulesPerBottle} capsules`,
              description: `${product.caffeineMgPerCapsule}mg caffeine per capsule. Zero sugar.`,
            },
          },
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: checkout.maxQuantity,
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ["NZ"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: toCents(checkout.shippingNZD),
              currency: "nzd",
            },
            display_name:
              checkout.shippingNZD === 0
                ? "NZ-wide shipping — free"
                : "NZ-wide shipping",
          },
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: siteUrl,
    });

    if (!session.url) {
      throw new Error("Stripe returned a session without a checkout URL.");
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("[upstate] Stripe checkout session failed:", error);
    return Response.json({ error: "checkout_failed" }, { status: 500 });
  }
}
