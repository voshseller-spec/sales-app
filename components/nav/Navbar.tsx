"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

const links = [
  { href: "/for-reps", label: "For reps" },
  { href: "/for-agencies", label: "For agencies" },
  { href: "/assessment", label: "AI assessment" },
  { href: "/jobs", label: "Jobs" },
  { href: "/community", label: "Community" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted hover:text-ink transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button href="/signup" size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>
          <button
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      <div
        className={cn(
          "lg:hidden border-t border-border bg-bg overflow-hidden transition-all",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="container py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-base text-ink"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3">
            <Button href="/login" variant="outline" size="sm" className="flex-1">
              Log in
            </Button>
            <Button href="/signup" size="sm" className="flex-1">
              Get started
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
