import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between bg-ink text-bg p-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <Logo className="text-bg [&_span:last-child]:text-bg" />
        </div>
        <div className="relative space-y-6">
          <blockquote className="text-2xl font-semibold leading-snug tracking-tight">
            "The verified score got me past the resume filter at three agencies I'd been ghosted by.
            Two weeks later I had offers from all three."
          </blockquote>
          <div className="text-sm text-bg/60">Dani V. — first-year closer · Verified 88</div>
        </div>
        <div className="relative text-xs text-bg/40">
          © {new Date().getFullYear()} Closer Labs
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-end px-6 py-5 lg:hidden">
          <Link href="/" className="text-sm text-muted">Back to home</Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 text-sm text-muted">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
