"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Building2, Mic } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import type { Role } from "@/lib/types";

function SignupInner() {
  const params = useSearchParams();
  const initial = (params.get("role") as Role) ?? "rep";
  const [role, setRole] = useState<Role>(initial === "agency" ? "agency" : "rep");

  return (
    <AuthShell
      title={role === "rep" ? "Get your verified score." : "Hire vetted closers."}
      subtitle={role === "rep" ? "Free forever. 12 minutes to a score that travels." : "Browse only AI-verified talent. Pay when you match."}
      footer={
        <>
          Already on Closer?{" "}
          <Link href="/login" className="text-primary font-medium">Log in</Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-surface border border-border rounded-xl">
        <RoleTab active={role === "rep"} onClick={() => setRole("rep")} icon={<Mic size={14} />}>
          I'm a rep
        </RoleTab>
        <RoleTab active={role === "agency"} onClick={() => setRole("agency")} icon={<Building2 size={14} />}>
          I'm an agency
        </RoleTab>
      </div>

      <form className="space-y-4" action="#" method="post">
        <input type="hidden" name="role" value={role} />
        {role === "rep" ? <RepFields /> : <AgencyFields />}

        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" name="email" placeholder="you@yourdomain.com" required />
        </div>
        <div>
          <Label htmlFor="password" hint="Min. 8 characters">Password</Label>
          <Input id="password" type="password" name="password" placeholder="••••••••" required />
        </div>

        <Button className="w-full" size="lg">
          {role === "rep" ? "Create rep account" : "Create agency account"}
        </Button>
        <p className="text-xs text-subtle text-center">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupInner />
    </Suspense>
  );
}

function RoleTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition",
        active ? "bg-elevated text-ink shadow-soft" : "text-muted hover:text-ink"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function RepFields() {
  return (
    <>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" placeholder="Alex Rivera" required />
      </div>
      <div>
        <Label htmlFor="experience">Sales experience</Label>
        <Select id="experience" name="experience">
          <option>0–1 years (capable beginner)</option>
          <option>1–3 years</option>
          <option>3–5 years</option>
          <option>5+ years</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="motion">Strongest motion</Label>
        <Select id="motion" name="motion">
          <option>Closing</option>
          <option>SDR / Outbound</option>
          <option>Full-cycle</option>
          <option>Account management</option>
        </Select>
      </div>
    </>
  );
}

function AgencyFields() {
  return (
    <>
      <div>
        <Label htmlFor="company">Agency name</Label>
        <Input id="company" name="company" placeholder="Loophole AI" required />
      </div>
      <div>
        <Label htmlFor="vertical">Vertical</Label>
        <Select id="vertical" name="vertical">
          <option>AI agency — home services</option>
          <option>AI agency — B2B SaaS</option>
          <option>AI agency — creator economy</option>
          <option>AI agency — professional services</option>
          <option>Other AI offer</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="ticket">Avg ticket size</Label>
        <Select id="ticket" name="ticket">
          <option>$2k–$10k MRR</option>
          <option>$10k–$30k MRR</option>
          <option>$30k+ MRR or 6-figure projects</option>
        </Select>
      </div>
    </>
  );
}
