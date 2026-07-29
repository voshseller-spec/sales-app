---
name: frontend-design
description: Design system rules for building or editing any UI in this repo — the Upstate landing page and anything new. Use whenever writing or reviewing components, pages, styles, Tailwind classes, layout, typography, color, spacing, motion, or when integrating a third-party component (21st.dev or otherwise). Covers the token set, the type and tracking scale, the 8px grid, component patterns, motion law, and the anti-generic-AI rules that keep output from looking machine-made.
---

# Frontend design — Upstate

This is a real, already-built design system. It is not a starting suggestion.
Match it. When a request conflicts with it, follow the request but say which
rule you broke and why.

The look: **matte black industrial**. Brushed-chrome display type, hairline
borders, mono microcopy on a wide tracking ladder, square corners, one restrained
scroll reveal. It reads like equipment, not like a SaaS landing page.

Source of truth for tokens: `upstate/app/globals.css` (`@theme inline` block).
Source of truth for copy: `upstate/content.ts`. Never hardcode copy in a
component — it goes in `content.ts`.

## Color tokens

Five colors. There is no sixth. Never introduce a raw hex into a component.

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--color-ink` | `#0a0a0b` | `bg-ink` | Page background. Only background. |
| `--color-carbon` | `#141416` | `bg-carbon` | Raised surface — cards, panels. Often at `/60`. |
| `--color-graphite` | `#1f1f23` | `border-graphite` | Hairline borders and dividers. |
| `--color-steel` | `#9ba0a6` | `text-steel` | Body text, eyebrows, secondary. The default. |
| `--color-bolt` | `#e8e9eb` | `text-bolt` `bg-bolt` | High emphasis — solid buttons, hover states, focus ring, the ⚡ glyph. |

Rules:
- Hierarchy is built with **steel → bolt**, never with color. There is no
  accent hue. No blue, no purple, no gradient CTA.
- Depth comes from **hairline borders on carbon**, never from drop shadows.
  The single exception is `.floor-shadow`, a radial reflection under the
  product image.
- Pure `#fff` appears only as the solid-button hover (`hover:bg-white`) and
  inside the chrome gradient stops.

## Typography

Three families, each with one job. Wired through `next/font` in
`app/layout.tsx` — don't add a fourth font.

- **`font-display`** — Archivo Black, weight 400 only. Headlines and big
  figures. Always `uppercase`, always tight tracking. Pair with `.text-chrome`
  (or `.chrome-sheen`, hero wordmark only) — except where a display-sized
  figure is deliberately secondary, which takes flat `text-steel/60` instead
  so the chrome one stays dominant (see `ValueMath`).
- **`font-body`** — Inter. Paragraphs and long-form. The only thing set in
  sentence case.
- **`font-mono`** — JetBrains Mono. Eyebrows, spec strips, button labels,
  microcopy. Always `uppercase`, always on the tracking ladder below.

### The tracking ladder

The system's strongest signature: **the smaller the type, the wider the
letter-spacing.** Getting this wrong is the fastest way to make the page look
generic.

| Role | Size | Tracking |
|---|---|---|
| Hero wordmark | `text-[clamp(3.4rem,14vw,11rem)]` `leading-[0.9]` | `tracking-[-0.02em]` |
| Section heading `h2` | `text-3xl sm:text-4xl md:text-5xl` `leading-tight` | `tracking-tight` |
| Hero tagline | `text-sm sm:text-base` | `tracking-[0.55em] sm:tracking-[0.7em]` |
| Eyebrow (`SectionHeading`) | `text-[11px]` | `tracking-[0.3em]` |
| Other 11px mono labels | `text-[11px]` | `tracking-[0.22em]`–`tracking-[0.25em]` |
| Kicker / spec | `text-xs` | `tracking-[0.3em]` |
| Button label | `text-sm` | `tracking-[0.2em]` |
| Micro / caption | `text-[10px]` | `tracking-[0.15em]`–`tracking-[0.2em]` |
| Long mono disclaimer | `text-[11px]` | `tracking-[0.12em]` |

At 11px the exact value tracks density, not a single constant: `0.3em` for a
lone eyebrow, `0.22em`–`0.25em` where labels sit in a row or a grid,
`0.12em` for a full sentence set in mono. Wider tracking needs more room; when
the text is long or the column is narrow, tighten it. Match the nearest
existing example rather than forcing one number.

Body copy is the exception: `text-base leading-relaxed text-steel`, normal
tracking, sentence case.

### Measure

Never let a line run the full container. Headings cap at `max-w-3xl`, body
paragraphs at `max-w-md`. Section container is `max-w-6xl` with `px-5 sm:px-8`.

## Spacing — 8px grid

All spacing is a multiple of 4, and lands on 8 wherever possible. The rhythm
already in use: `gap-3` `mb-3` `mt-5` `mb-6` `mt-8` `mt-10` `mb-12` `mt-14`
`pb-20` `scroll-mt-24` `pt-28`.

- Heading block → its content: `mb-12`.
- Eyebrow → heading: `mb-3`.
- Section vertical padding: `pt-28 pb-20` on the hero; `py-20`–`py-24`
  elsewhere.
- Never use arbitrary one-off values like `mt-[13px]`. If you need a value
  off the grid, you're solving the wrong problem.

## Component patterns

### Buttons
Only `BuyButton` initiates checkout, and it always routes through
`initiateCheckout()` in `lib/checkout.ts`. Two variants, no third:

- **solid** — `bg-bolt text-ink hover:bg-white`
- **ghost** — `border border-graphite text-bolt hover:bg-bolt hover:text-ink hover:border-bolt`

Shared: `px-8 py-3.5 font-mono text-sm uppercase tracking-[0.2em]
transition-colors duration-200`.

### Square corners
**Nothing in this system has a border radius.** No `rounded-lg`, no
`rounded-2xl`, no pills. The only radius in the entire stylesheet is `2px` on
the focus ring. This is deliberate — it is most of why the page reads as
industrial. If you catch yourself adding `rounded-`, stop.

### Section heading
Use the `SectionHeading` component (`eyebrow` + `heading` + optional `id`).
Don't hand-roll an `h2`.

### Cards
Carbon surface, hairline border, square: `border border-graphite bg-carbon/60`.
No shadow, no glow, no gradient border.

## Motion

Framer Motion is installed in `upstate/` and is the standard for **new**
animation. It must reproduce the existing feel, not invent a new one — the
numbers below are the law, whether you implement them in CSS or Framer Motion:

- **Reveal:** 16px upward travel, `0.7s ease`, opacity 0 → 1. Fires **once**
  at ~15% visibility. Never re-animates on scroll back up
  (`viewport={{ once: true, amount: 0.15 }}`).
- **Stagger:** 60–80ms between siblings. Never more — long stagger reads as
  slow, not premium.
- **Hover:** color transitions only, `duration-200`. No scale-up on buttons,
  no lift, no tilt.
- **Chrome sweep:** hero wordmark only, 8s loop, `background-position` only.
  Never animate a second element on a loop.
- **`prefers-reduced-motion`:** every animation must have a reduced-motion
  path that renders the final state with no transition.

### The reduced-motion trap — verified, do not skip

Any Framer Motion element that reveals on scroll **must carry the
`data-reveal` attribute**, which `globals.css` uses to force
`opacity:1; transform:none !important` under `prefers-reduced-motion: reduce`.

`useReducedMotion()` alone is not enough, and the failure is silent. A
`motion.div` server-renders its hidden state as an *inline*
`style="opacity:0;transform:translateY(16px)"` — that's what stops the page
flashing before hydration. When the client then renders a plain `<div>`
instead, React has no `style` prop to reconcile and **leaves the inline style
on the node**. The section stays invisible, with no hydration warning. Only an
`!important` stylesheet rule outranks an inline style, which is why the CSS
net exists.

Verified in Chromium at 1280px and 360px, with and without JS. Test any new
reveal the same way — reduced-motion is not something to eyeball.

Known and accepted: with JS disabled *and* reduced motion off, revealed
sections stay hidden. That predates Framer Motion — the CSS `.fade-up` behaves
identically — and it affects the whole page, not just the migrated section.

Animate `transform` and `opacity` only — they're compositor-cheap. Animating
layout properties would break the CLS 0 the page currently holds.

The existing CSS `FadeUp` component still works and is used across the site;
leave it in place unless asked to migrate. New sections may use either, but
must match the numbers above so the two are indistinguishable.

## Accessibility — non-negotiable

- Focus ring is global: `2px solid bolt`, `3px` offset. Never remove it.
- Decorative glyphs (including ⚡) get `aria-hidden="true"`.
- Image slots that convey meaning get `role="img"` + `aria-label`.
- Contrast floors on `carbon`, measured: `steel` = 6.9:1, `steel/80` = 4.9:1,
  `steel/60` = 3.3:1. So **`/80` is the floor for body-sized text** (AA needs
  4.5:1), and `/60` is permitted *only* on large display type — 24px+, or
  18.7px+ bold — where AA needs just 3:1. Never put `/60` on a paragraph.
- Every interactive element must be a real `<button>` or `<a>`.

## Avoid the generic AI aesthetic

These are the tells. None of them belong here:

- Purple/blue/indigo gradient hero backgrounds or gradient CTA buttons.
- `rounded-2xl` glassmorphism cards with `backdrop-blur` and a soft shadow.
  Blur is not banned outright — it is correct on the sticky `Nav`
  (`bg-ink/85 backdrop-blur-md` once scrolled) and on the `CheckoutModal`
  scrim. It is banned on *cards and panels*, which use hairline borders.
- Emoji as feature icons. The only glyph in this system is ⚡, already
  established, used sparingly.
- Three feature cards in a row, each with a circular icon badge above a bold
  title and two lines of grey filler.
- Everything center-aligned. The hero is centered on purpose; body sections
  are not.
- Invented hex values, invented font sizes, invented shadows.
- "Elevate your experience" / "Unlock the power of" copy. Copy in this project
  is flat, specific and slightly dry — read `content.ts` and match its voice.

## Performance floor

The page currently scores **Lighthouse 94 perf / 96 a11y / 100 BP / 100 SEO,
CLS 0**. Don't regress it:

- Images via `next/image` with explicit `width`/`height` and `sizes`.
  `priority` on the hero image only.
- Fonts via `next/font` with `display: "swap"` — already configured.
- No layout-shifting animation. No blocking third-party scripts; the
  analytics slot in `layout.tsx` is where they go, via `next/script`.

## Before you call UI work done

1. Tokens only — no raw hex, no off-grid spacing, no fourth font.
2. Tracking ladder correct for every type size used.
3. No `rounded-*` anywhere.
4. Reduced-motion path exists and renders the final state.
5. Focus visible on every interactive element.
6. Checked at **360px** — the narrowest supported width — as well as desktop.
7. Copy lives in `content.ts`, not in the component.
