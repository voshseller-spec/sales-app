import { Flame, MessageSquarePlus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ThreadCard } from "@/components/community/ThreadCard";
import { threads } from "@/lib/mock";

export const metadata = { title: "Community — Closer" };

const categories = ["All", "Wins", "Scripts", "Objections", "Tools", "Hiring"] as const;

export default function CommunityPage() {
  return (
    <div className="container py-14 md:py-20">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Community</h1>
          <p className="mt-3 text-muted">
            Scripts, objections, wins, and hiring threads. Learn from reps scoring 90+ and agencies actively hiring.
          </p>
        </div>
        <Button>
          <MessageSquarePlus size={16} />
          New thread
        </Button>
      </div>

      <div className="mt-8 flex gap-2 flex-wrap">
        {categories.map((c, i) => (
          <button
            key={c}
            className={`text-sm px-3.5 h-9 rounded-full border transition ${
              i === 0
                ? "bg-ink text-bg border-ink"
                : "border-border text-muted hover:text-ink hover:bg-surface"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted">
        <Flame size={13} className="text-warning" />
        Trending today · sorted by signal
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {threads.map((t) => (
          <ThreadCard key={t.id} thread={t} />
        ))}
      </div>

      <aside className="mt-12 grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-elevated p-5">
          <Badge tone="primary">Live</Badge>
          <h3 className="mt-3 font-semibold text-ink">AMA: Hiring your first closer</h3>
          <p className="mt-1 text-sm text-muted">Tomorrow, 2pm ET · with the founder of Loophole AI.</p>
        </div>
        <div className="rounded-xl border border-border bg-elevated p-5">
          <Badge tone="accent">New</Badge>
          <h3 className="mt-3 font-semibold text-ink">Top 100 verified closers — May 2026</h3>
          <p className="mt-1 text-sm text-muted">This month's leaderboard, ranked by closing sub-score.</p>
        </div>
        <div className="rounded-xl border border-border bg-elevated p-5">
          <Badge>Guide</Badge>
          <h3 className="mt-3 font-semibold text-ink">The 12-minute prep checklist</h3>
          <p className="mt-1 text-sm text-muted">What to run before every discovery call. Free PDF.</p>
        </div>
      </aside>
    </div>
  );
}
