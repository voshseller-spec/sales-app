"use client";

import { useEffect, useState } from "react";
import { content } from "@/content";
import BuyButton from "./BuyButton";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
        scrolled
          ? "border-b border-graphite bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="font-display text-lg uppercase tracking-tight text-bolt"
        >
          {content.brand.name}
        </a>
        <BuyButton label="Buy" variant="ghost" className="!px-6 !py-2" />
      </nav>
    </header>
  );
}
