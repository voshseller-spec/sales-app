/**
 * Minimal class-name joiner.
 *
 * Most components copied from 21st.dev / shadcn open with:
 *     import { cn } from "@/lib/utils"
 * which normally resolves to `clsx` + `tailwind-merge` — two dependencies this
 * project deliberately doesn't carry. This is the drop-in replacement: change
 * the import to `@/lib/cn` and the component compiles unchanged.
 *
 *     cn("px-8 py-3.5", isActive && "text-bolt", className)
 *
 * KNOWN LIMITATION — read before relying on it:
 * this does NOT resolve conflicting Tailwind utilities. Real `tailwind-merge`
 * makes `cn("px-4", "px-8")` collapse to `"px-8"`; this returns `"px-4 px-8"`
 * and the winner is then decided by declaration order in the generated
 * stylesheet, which is not something you control. So:
 *
 *   - Don't layer a base class and an override of the same property and expect
 *     the override to win. Pick one with a ternary instead — the pattern
 *     `BuyButton` already uses.
 *   - A `className` prop appended at the end is fine for ADDING properties,
 *     not for overriding existing ones. If a caller must override, use `!`
 *     (`!px-6`), as `Nav` does.
 *
 * If a component genuinely needs conflict resolution, that's a fair reason to
 * install `clsx` + `tailwind-merge` (~5kB together) — say so first.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
