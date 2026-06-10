# Closer

**Verified closers. Real revenue.**

The vetted marketplace where AI agencies hire closers (and where closers — including
capable beginners — get a real shot via an AI-verified skill score).

This is the **front-end scaffold** — Next.js (App Router) + React + TypeScript +
Tailwind. All data is mocked in `/lib/mock.ts`. No backend yet.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run build       # production build
npm run start       # serve production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

## Pages

| Route               | What's there |
| ------------------- | ------------ |
| `/`                 | Landing — hero, how-it-works, social proof, dual CTA. |
| `/for-reps`         | Pitch for salespeople + AI assessment hook. |
| `/for-agencies`     | Pitch for AI agencies + vetting/trust messaging. |
| `/matches`          | Swipe-card matching UI (Framer Motion). |
| `/assessment`       | AI Closer Score explainer + sample breakdown + verified badge. |
| `/profile/[id]`     | Rep portfolio: stats, score, breakdown, industries, terms. |
| `/jobs`             | Browsable roles with filter bar (search + type + location). |
| `/pricing`          | Free for reps; 4-tier agency pricing. |
| `/community`        | Forum-style threads (mocked). |
| `/login`, `/signup` | Dual-path auth (rep vs agency). |

## Design tokens

Tokens live in `app/globals.css` (CSS variables for light + dark) and
`tailwind.config.ts` (semantic color names, type scale, radii, shadows, motion).

- **Aesthetic:** clean & high-trust (Stripe-adjacent).
- **Mode:** light + dark via `class="dark"` on `<html>`, toggle in navbar, persisted in `localStorage`.
- **Primary:** `#635BFF` (indigo). **Accent:** `#00C48C` (verified-green).
- **Type:** Inter (UI) + JetBrains Mono (numerics, scores).

## Structure

```
app/                 # routes
  (auth)/            # grouped auth routes
  profile/[id]/      # dynamic rep profile
components/
  ui/                # design system: Button, Card, Input, Badge, Avatar, ScoreRing, VerifiedBadge, ThemeToggle, Logo, Section
  marketing/         # Hero, HowItWorks, SocialProof, CTASection, FeatureGrid
  match/             # SwipeCard, SwipeStack
  profile/           # ScoreBreakdown
  jobs/              # JobCard, FilterBar
  community/         # ThreadCard
  nav/               # Navbar, Footer
  auth/              # AuthShell
lib/
  mock.ts            # reps, agencies, jobs, threads, sample score
  types.ts           # Rep, Agency, Job, ScoreBreakdown, Thread, Role
  cn.ts              # className helper (clsx + tailwind-merge)
tailwind.config.ts
app/globals.css
```

## What's stubbed

- All form actions submit to `#` — handlers will be wired when the backend lands.
- Swipe interactions update local state only.
- Avatars use [dicebear initials](https://www.dicebear.com/) — no real photos.
- Match/score data is fixture data in `/lib/mock.ts`.

## What's responsive

Mobile-first across every page. Navbar collapses under `lg`; auth screens hide the
testimonial panel under `lg`; matches stack and pricing tiers wrap at 2 cols, then 1.
