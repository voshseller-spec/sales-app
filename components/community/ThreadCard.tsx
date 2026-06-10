import { Heart, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Thread } from "@/lib/types";

const toneFor: Record<Thread["category"], React.ComponentProps<typeof Badge>["tone"]> = {
  Wins: "accent",
  Scripts: "primary",
  Objections: "warning",
  Tools: "neutral",
  Hiring: "danger",
};

export function ThreadCard({ thread }: { thread: Thread }) {
  return (
    <article className="rounded-xl border border-border bg-elevated p-5 shadow-soft hover:shadow-lift transition">
      <div className="flex items-start gap-4">
        <Avatar src={thread.authorAvatar} name={thread.author} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-subtle">
            <Badge tone={toneFor[thread.category]}>{thread.category}</Badge>
            <span>·</span>
            <span>{thread.author}</span>
            <span>·</span>
            <span>{thread.postedAgo}</span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold text-ink leading-snug">{thread.title}</h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">{thread.preview}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Heart size={12} /> {thread.likes}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={12} /> {thread.replies}
          </span>
        </div>
      </div>
    </article>
  );
}
