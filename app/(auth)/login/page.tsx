import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export const metadata = { title: "Log in — Closer" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in to your Closer account."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-primary font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" action="#" method="post">
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" name="email" placeholder="you@yourdomain.com" required />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-xs text-primary">Forgot?</Link>
          </div>
          <Input id="password" type="password" name="password" placeholder="••••••••" required />
        </div>
        <Button className="w-full" size="lg">Log in</Button>
        <div className="text-center text-xs text-subtle">
          or continue with
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">Google</Button>
          <Button variant="outline">LinkedIn</Button>
        </div>
      </form>
    </AuthShell>
  );
}
