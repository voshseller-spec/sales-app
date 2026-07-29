"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion reveal primitives.
 *
 * These reproduce the existing CSS `.fade-up` exactly — same 16px travel, same
 * 0.7s curve, same fire-once-at-15% trigger — so Framer-animated sections and
 * the older CSS-animated ones are indistinguishable on the page. The numbers
 * are fixed by the design skill (.claude/skills/frontend-design/SKILL.md);
 * don't retune them per-section.
 *
 * Use <Reveal> for a single element, and <RevealGroup>/<RevealItem> when
 * siblings should cascade.
 */

/** cubic-bezier for CSS `ease` — what .fade-up transitions on today. */
const CSS_EASE = [0.25, 0.1, 0.25, 1] as const;
const DURATION = 0.7;
const TRAVEL = 16;
/** 70ms between siblings. Longer reads as sluggish, not premium. */
const STAGGER = 0.07;

const VIEWPORT = { once: true, amount: 0.15 } as const;

const item: Variants = {
  hidden: { opacity: 0, y: TRAVEL },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: CSS_EASE },
  },
};

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Every element below carries `data-reveal`, which globals.css uses to force
 * the final state under `prefers-reduced-motion: reduce`. That CSS rule is not
 * optional decoration — these components server-render their hidden state as
 * an inline style, and an inline style survives React hydration even when the
 * client render drops it. Without the attribute the content never appears.
 */

/** Single element, revealed on first scroll into view. */
export function Reveal({ children, className }: Props) {
  const reduced = useReducedMotion();
  if (reduced)
    return (
      <div data-reveal className={className}>
        {children}
      </div>
    );

  return (
    <motion.div
      data-reveal
      className={className}
      variants={item}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

/** Wrapper that cascades its <RevealItem> children. */
export function RevealGroup({ children, className }: Props) {
  const reduced = useReducedMotion();
  if (reduced)
    return (
      <div data-reveal className={className}>
        {children}
      </div>
    );

  return (
    <motion.div
      data-reveal
      className={className}
      variants={group}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

/**
 * A cascading child. Inherits the animation state from its RevealGroup parent,
 * so it takes no viewport props of its own. Outside a RevealGroup it renders
 * hidden — use <Reveal> for standalone elements.
 */
export function RevealItem({ children, className }: Props) {
  const reduced = useReducedMotion();
  if (reduced)
    return (
      <div data-reveal className={className}>
        {children}
      </div>
    );

  return (
    <motion.div data-reveal className={className} variants={item}>
      {children}
    </motion.div>
  );
}
