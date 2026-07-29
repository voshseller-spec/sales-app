---
name: component-integration
description: Adapt a third-party UI component — pasted from 21st.dev, shadcn/ui, a blog, or any library — into this project. Use whenever the user pastes component code, links a component, or asks to drop in a hero, pricing table, testimonial, navbar, footer, bento grid, or marquee. Covers the dependency and Tailwind-version traps specific to this repo, plus the conversion checklist that strips a component's own design language and reskins it in the Upstate system.
---

# Integrating a third-party component

Source library of choice: **21st.dev** — production-designed heroes, pricing
tables, testimonials, navbars, footers. Browsing and copying is a human step;
the model cannot reach the site from this environment (see "Network" below).

The job is never "paste it in". Every component arrives wearing its author's
design language, and this project has a strong one of its own. Reskin it or it
will look bolted on.

Read `.claude/skills/frontend-design/SKILL.md` first — it is the target system.

## Two traps specific to this repo

Check both **before** writing any code. They are where pasted components break.

### 1. Missing dependencies

`upstate/` runs a deliberately thin stack: `next`, `react`, `react-dom`,
`framer-motion`. That's all.

It does **not** have — and most 21st.dev / shadcn components assume some of —
`shadcn/ui`, `@radix-ui/*`, `lucide-react`, `clsx`, `class-variance-authority`,
`tailwind-merge`, or a `cn()` helper.

When a pasted component imports any of those, you have two options. Default to
the second:

- **Rewrite without them.** Usually easy: `cn()` becomes a template literal
  (that's what `BuyButton` already does), `cva` variants become a plain
  ternary, a `lucide` icon becomes inline SVG. Preferred — it keeps the
  bundle small and the Lighthouse score where it is.
- **Add the dependency deliberately.** Only when the component genuinely needs
  it — Radix for an accessible dialog or dropdown is a fair reason. Say so
  before installing, and never pull in all of shadcn to get one button.

### 2. Tailwind v4, no config file

This project is on **Tailwind v4**, with tokens declared in an `@theme inline`
block in `upstate/app/globals.css`. There is no `tailwind.config.js` and there
should not be one.

Most component code in the wild is written for **v3**. Symptoms and fixes:

| Pasted code does this (v3) | Do this instead (v4) |
|---|---|
| "Add this to `tailwind.config.js`" | Add the token to `@theme inline` in `globals.css` — or better, map it onto an existing token |
| `bg-slate-900`, `text-gray-400`, `bg-zinc-800` | Map to `bg-ink` / `bg-carbon` / `text-steel` / `text-bolt` |
| `@apply` chains in a CSS file | Inline the utilities on the element |
| `dark:` variants | Drop them — the site is permanently dark, there is no light mode |
| Custom `theme.extend` fonts | Use `font-display` / `font-body` / `font-mono`; don't add a fourth |

## Conversion checklist

Work top to bottom. The component is done when every line is true.

1. **Colors** — every hex, every `slate/gray/zinc/indigo` utility replaced by
   one of the five tokens. Zero raw hex survives.
2. **Corners** — delete every `rounded-*`. This system is square.
3. **Shadows** — delete every `shadow-*`, `drop-shadow-*`, `backdrop-blur`.
   Depth is `border border-graphite` on `bg-carbon/60`.
4. **Gradients** — delete decorative gradients. The only gradients allowed are
   `.text-chrome` / `.chrome-sheen` on display type and `.floor-shadow`.
5. **Type** — headings to `font-display uppercase` + `.text-chrome`; labels and
   eyebrows to `font-mono uppercase` on the tracking ladder; body to
   `font-body`. Apply the correct tracking for each size — this is the step
   that's most often skipped and most visible when it is.
6. **Spacing** — snap to the 8px grid. Drop the component's arbitrary values.
7. **Motion** — strip its animation library and its scroll/hover effects.
   Re-add reveals with `Reveal` / `RevealGroup` from
   `upstate/components/Reveal.tsx`. Hover is color-only, `duration-200`.
8. **Copy** — move every string into `upstate/content.ts` and read it through
   the `content` object. No literal copy in the component. Match the existing
   voice: flat, specific, slightly dry.
9. **Icons** — drop icon-library imports. Inline SVG, `aria-hidden="true"`,
   `currentColor`. Don't substitute emoji; ⚡ is the only glyph in the system.
10. **Accessibility** — real `<button>`/`<a>` elements, visible focus ring
    intact, decorative elements hidden from screen readers, images with
    meaningful `alt`.
11. **Images** — `next/image` with explicit `width`/`height` and `sizes`,
    so CLS stays at 0.
12. **Client boundary** — add `"use client"` only if the component actually
    uses state, effects, or Framer Motion. Keep it a server component
    otherwise.
13. **Verify** — `npm run build` in `upstate/`, then check the section at
    desktop **and 360px**.

## The prompt to use

After pasting component code:

> Integrate this component into the Upstate landing page. Follow
> `.claude/skills/frontend-design/SKILL.md`: reskin it to the five design
> tokens, square corners, the tracking ladder, and the 8px grid. Replace its
> animation with `Reveal`/`RevealGroup`. Move all copy into `content.ts`.
> Rewrite around any missing dependency rather than installing shadcn/radix.
> Then build and show me desktop plus 360px.

## Network

`21st.dev` is blocked by this session's egress policy (`CONNECT tunnel failed,
403`), as is every `notion.so` / `notion.site` host. So: **browse and copy on
your machine, paste the code into chat.** Don't try to fetch component source
directly — it will fail, and routing around the proxy is not an option.
