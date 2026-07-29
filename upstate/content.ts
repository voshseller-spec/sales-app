/**
 * All editable site content lives here.
 * Edit copy, price, and product details in this file — no component changes needed.
 */

export const content = {
  brand: {
    name: "UPSTATE",
    tagline: "ENERGY ANYWHERE",
    // PLACEHOLDER: replace with the real contact address
    contactEmail: "hello@upstate.co.nz",
  },

  product: {
    name: "Upstate Caffeine",
    caffeineMgPerCapsule: 100,
    capsulesPerBottle: 500,
    // PLACEHOLDER: set the real retail price (NZD)
    priceNZD: 59,
    currency: "NZD",
    // PLACEHOLDER: drop a tall portrait bottle render into /public and set the
    // path here (e.g. "/bottle.png"). null renders a styled empty slot.
    imageSrc: null as string | null,
    imageAlt:
      "Matte black Upstate bottle with embossed black-on-black wordmark, 500 capsules, 100mg caffeine per capsule",
  },

  hero: {
    positioning:
      "One capsule. 100mg of caffeine. Nothing else worth mentioning.",
    primaryCta: "Buy",
    secondaryCta: "See what's inside ↓",
  },

  // Rendered as the horizontal mono spec strip, in order.
  specStrip: [
    "100MG CAFFEINE / CAPSULE",
    "500 CAPSULES",
    "ZERO SUGAR",
    "ZERO CRASH-FILLERS", // VERIFY CLAIM: confirm formulation contains no other stimulants/fillers before shipping this line
    "MADE FOR DAILY USE", // VERIFY CLAIM: confirm daily-use positioning is acceptable under NZ supplement rules
  ],

  whyPills: {
    eyebrow: "THE CASE FOR CAPSULES",
    heading: "Caffeine, minus the delivery vehicle",
    blocks: [
      {
        title: "A precise dose",
        body: "A long black is somewhere between 60 and 160mg depending on the beans, the barista and the day. A capsule is 100mg. Every time. You can actually plan around that.",
      },
      {
        title: "No sugar, no liquid",
        body: "Energy drinks are caffeine dissolved in half a litre of flavoured sugar water. Skip the vehicle and keep the active ingredient. Nothing to refrigerate, nothing to sip warm at 3pm.",
      },
      {
        title: "Cents, not dollars",
        body: "One bottle holds 500 servings. That works out to a fraction of the price of a café coffee or a can — the same caffeine at roughly a hundredth of the shelf space.",
      },
    ],
  },

  supplementFacts: {
    eyebrow: "SUPPLEMENT FACTS",
    servingSize: "1 capsule",
    servingsPerContainer: 500,
    rows: [
      {
        label: "Caffeine (anhydrous)", // CONFIRM WITH LABEL: caffeine form
        amount: "100mg",
        dailyValue: "†",
      },
    ],
    otherIngredients:
      "Microcrystalline cellulose, hypromellose (capsule), magnesium stearate", // CONFIRM WITH LABEL: actual excipient list
    footnote: "† Daily value not established.",
  },

  dosing: {
    eyebrow: "USAGE",
    heading: "How to take it",
    guidance: [
      "Take one capsule as needed. One capsule is roughly the caffeine of one cup of coffee.",
      "Most health authorities suggest healthy adults keep total caffeine under 400mg per day, from all sources combined.",
      "Don't stack capsules with coffee, energy drinks or pre-workout without doing that arithmetic first.",
      "Not for people under 18, or during pregnancy or breastfeeding. If you're sensitive to caffeine or on medication, talk to your doctor before use.",
    ],
    disclaimer:
      "Food supplement. Not a substitute for a balanced diet. Keep out of reach of children. Store below 25°C in a dry place.", // CONFIRM WITH LABEL: storage and regulatory fine print
  },

  valueMath: {
    eyebrow: "THE MATH",
    heading: "Cost per 100mg of caffeine",
    // Column label for the Upstate figure, and the shared unit caption under
    // every column. Both were hardcoded in ValueMath.tsx; moved here so all
    // copy lives in one file. Strings are unchanged.
    upstateLabel: "Upstate capsule",
    unitLabel: "per ~100mg caffeine",
    // PLACEHOLDER: sanity-check comparison prices for your market
    comparisons: [
      { label: "Café coffee", priceNZD: 5.5 },
      { label: "Energy drink", priceNZD: 4.5 },
    ],
    note: "Upstate per-serving price is the bottle price divided by 500 capsules. Comparison prices are typical NZ retail; your café may disagree.",
  },

  faq: {
    eyebrow: "QUESTIONS",
    heading: "Asked and answered",
    items: [
      {
        q: "How much caffeine is in one capsule compared to coffee?",
        a: "Each capsule contains exactly 100mg of caffeine. A typical cup of coffee lands anywhere from 60 to 160mg depending on how it's made. One capsule ≈ one solid cup, without the variance.",
      },
      {
        q: "How many should I take?",
        a: "One at a time, as needed. Keep your total daily caffeine — from all sources — under the commonly cited 400mg guideline for healthy adults. That's a hard ceiling, not a target.",
      },
      {
        q: "What's actually in it?",
        a: "Caffeine, a capsule shell, and the minimal excipients needed to make a capsule hold together. The full list is in the supplement facts panel above. No sugar, no sweeteners, no proprietary blend.",
      },
      {
        q: "Do you ship across New Zealand?",
        a: "Yes — NZ-wide shipping on every order. One bottle is 500 servings, so shipping is something you'll deal with about twice a year.",
      },
      {
        q: "What's your returns policy?",
        a: "Unopened bottles can be returned within 30 days for a full refund. Email us and we'll sort it out without a form or a fight.", // VERIFY CLAIM: confirm the actual returns window and terms
      },
      {
        q: "Is this safe to take every day?",
        a: "Caffeine is one of the most studied compounds people consume, and 100mg is about one coffee. If a daily coffee is fine for you, this is the same dose in a duller outfit. If you have a medical condition or take medication, ask your doctor.",
      },
    ],
  },

  finalCta: {
    heading: "Energy anywhere",
    subline: "500 capsules. One decision, twice a year.",
    button: "Buy",
  },

  footer: {
    disclaimer:
      "This product is not intended to diagnose, treat, cure or prevent any disease. Always read the label and use as directed.",
    copyrightName: "Upstate",
  },
} as const;

/** Bottle price divided by capsule count, e.g. "$0.12". */
export function perServingNZD(): number {
  return content.product.priceNZD / content.product.capsulesPerBottle;
}

export function formatNZD(n: number, opts?: { cents?: boolean }): string {
  if (opts?.cents) return `$${n.toFixed(2)}`;
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}
