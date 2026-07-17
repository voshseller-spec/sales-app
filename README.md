# Upstate — Energy Anywhere

Single-product landing page for Upstate caffeine capsules (100mg / capsule,
500 capsules / bottle). Next.js App Router + TypeScript + Tailwind CSS.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Edit content

Everything editable — copy, price, specs, FAQ, contact email, product image —
lives in [`content.ts`](./content.ts). Components never hard-code copy.

Placeholders to fill in `content.ts`:

- `brand.contactEmail` — real contact address
- `product.priceNZD` — real retail price
- `product.imageSrc` — drop a tall portrait bottle render into `public/`
  (e.g. `public/bottle.png`) and set this to `"/bottle.png"`
- `valueMath.comparisons` — sanity-check the coffee / energy-drink prices

Search the file for `VERIFY CLAIM` and `CONFIRM WITH LABEL` comments before
launch — those mark copy that needs a compliance / label check.

## Stripe (later)

All buy buttons call `initiateCheckout()` in
[`lib/checkout.ts`](./lib/checkout.ts). That is the **only** file to edit when
Stripe arrives — replace the function body with a Stripe Checkout redirect
(instructions are in the file header). Today it opens a "checkout coming
soon" email-capture modal (stored in localStorage, `// TODO: wire to email
provider`).

## Deploy to Vercel

This app lives at the repository root, so no Root Directory override is needed.

1. [vercel.com/new](https://vercel.com/new) → Import the GitHub repo.
2. Framework preset auto-detects Next.js. Leave Root Directory as `./`.
3. No env vars needed.
4. Deploy.

Or with the CLI: `npx vercel` (accept defaults), then `npx vercel --prod`.

> Note: an existing Vercel project (`sales-app`) still has its Root Directory
> set to `upstate` from the previous layout. If you deploy this repo through
> that project, clear that setting (Root Directory → `./`) so it builds from
> the root.

## Analytics

Intentionally none. A commented slot for a pixel/analytics script is in
[`app/layout.tsx`](./app/layout.tsx).
