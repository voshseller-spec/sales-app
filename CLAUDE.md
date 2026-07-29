# CLAUDE.md

## Website build stack
The Next.js site lives in `upstate/` (Next 16 + Tailwind v4). The Express
sales-trainer app at the repo root is unrelated — don't mix dependencies
between them.

- **Design system.** `.claude/skills/frontend-design/SKILL.md` is the source of
  truth for tokens, type, spacing, and motion. Read it before writing or
  editing any UI. It is a description of what's already built, not a proposal.
- **Animation.** Framer Motion is installed in `upstate/`. Use it for all new
  animation, via `Reveal` / `RevealGroup` in `upstate/components/Reveal.tsx` —
  they match the existing CSS `FadeUp` exactly (16px, 0.7s, fires once).
  Scroll-triggered fades, staggered reveals, and colour-only hover transitions
  on interactive elements. Every animation needs a reduced-motion path.
- **Components.** Third-party components (21st.dev and similar) get adapted,
  never pasted as-is — `.claude/skills/component-integration/SKILL.md` has the
  conversion checklist and this repo's two gotchas (thin dependency set,
  Tailwind v4 with no config file).
- **Copy** lives in `upstate/content.ts`, never in components.
- **Don't regress** Lighthouse 94 perf / 96 a11y / 100 BP / 100 SEO, CLS 0.

## Notion sync protocol
Shared page: https://app.notion.com/p/3a0956ea36eb81dba3eefc4e915144e4
- At session START: fetch this page, read the "📤 Chat → Code" section, execute the top unfinished instruction.
- At session END and after major milestones: append a status entry to "📥 Code → Chat" — what you did, result, anything blocked/needs a decision. Under 10 lines.
- Mark completed instructions ✅ with a one-line result.
- Never delete other sections.
