"use client";

import { useMemo, useState } from "react";
import { Heart, RotateCcw, Star, X } from "lucide-react";
import { SwipeCard } from "./SwipeCard";
import type { Rep } from "@/lib/types";

export function SwipeStack({ initial }: { initial: Rep[] }) {
  const [queue, setQueue] = useState(initial);
  const [history, setHistory] = useState<{ rep: Rep; dir: "left" | "right" }[]>([]);

  const top = queue[0];
  const next = useMemo(() => queue.slice(0, 4), [queue]);

  const handleSwipe = (dir: "left" | "right") => {
    if (!top) return;
    setHistory((h) => [{ rep: top, dir }, ...h]);
    setQueue((q) => q.slice(1));
  };

  const undo = () => {
    const last = history[0];
    if (!last) return;
    setHistory((h) => h.slice(1));
    setQueue((q) => [last.rep, ...q]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-[640px]">
        {next.length === 0 ? (
          <EmptyState onReset={() => setQueue(initial)} />
        ) : (
          next
            .map((rep, i) => (
              <SwipeCard
                key={rep.id}
                rep={rep}
                index={i}
                isTop={i === 0}
                onSwipe={handleSwipe}
              />
            ))
            .reverse()
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <ActionButton label="Pass" onClick={() => handleSwipe("left")} tone="danger">
          <X size={22} />
        </ActionButton>
        <ActionButton label="Undo" onClick={undo} tone="ghost" disabled={history.length === 0}>
          <RotateCcw size={18} />
        </ActionButton>
        <ActionButton label="Shortlist" onClick={() => handleSwipe("right")} tone="warning">
          <Star size={20} />
        </ActionButton>
        <ActionButton label="Match" onClick={() => handleSwipe("right")} tone="accent" big>
          <Heart size={24} />
        </ActionButton>
      </div>

      <div className="mt-5 text-xs text-subtle">
        Swipe right to match · {history.length} viewed · {queue.length} left
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  label,
  tone,
  big,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  tone: "danger" | "accent" | "warning" | "ghost";
  big?: boolean;
  disabled?: boolean;
}) {
  const styles = {
    danger: "border-danger/30 text-danger bg-danger-soft hover:bg-danger hover:text-white",
    accent: "border-accent/30 text-accent bg-accent-soft hover:bg-accent hover:text-white",
    warning: "border-amber-300/40 text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white dark:bg-amber-950/40 dark:text-amber-300",
    ghost: "border-border text-muted bg-elevated hover:bg-surface",
  }[tone];
  const sizing = big ? "h-16 w-16" : "h-12 w-12";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`${sizing} rounded-full border shadow-soft transition flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none ${styles}`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 rounded-2xl border border-dashed border-border bg-surface/30">
      <div className="h-12 w-12 rounded-full bg-accent-soft text-accent inline-flex items-center justify-center mb-4">
        <Heart size={22} />
      </div>
      <h3 className="text-lg font-semibold text-ink">You're caught up.</h3>
      <p className="mt-2 text-sm text-muted max-w-xs">
        We'll send fresh matches as soon as new closers verify their scores.
      </p>
      <button onClick={onReset} className="mt-5 text-sm text-primary font-medium">
        Reset the stack
      </button>
    </div>
  );
}
