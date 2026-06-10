import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <div className="font-mono text-sm text-subtle">404</div>
      <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-ink">
        That page didn't make quota.
      </h1>
      <p className="mt-3 text-muted">Try heading back home, or browse open roles.</p>
      <div className="mt-7 flex justify-center gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/jobs" variant="outline">Browse jobs</Button>
      </div>
    </div>
  );
}
