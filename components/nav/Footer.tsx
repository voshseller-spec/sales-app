import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const groups = [
  {
    title: "Reps",
    links: [
      { href: "/for-reps", label: "Why Closer" },
      { href: "/assessment", label: "AI assessment" },
      { href: "/jobs", label: "Open roles" },
      { href: "/community", label: "Community" },
    ],
  },
  {
    title: "Agencies",
    links: [
      { href: "/for-agencies", label: "Hire closers" },
      { href: "/matches", label: "Matching" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Trust & safety" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40 mt-12">
      <div className="container py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-muted max-w-[14rem]">
            The vetted marketplace for AI agencies and the closers who scale them.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle mb-4">
              {g.title}
            </div>
            <ul className="space-y-2.5">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted hover:text-ink transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-subtle">
          <div>© {new Date().getFullYear()} Closer Labs. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
