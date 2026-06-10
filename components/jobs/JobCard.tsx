import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import type { Agency, Job } from "@/lib/types";

export function JobCard({ job, agency }: { job: Job; agency: Agency }) {
  return (
    <article className="group rounded-xl border border-border bg-elevated p-6 shadow-soft hover:shadow-lift transition">
      <div className="flex items-start gap-4">
        <Avatar src={agency.logo} name={agency.name} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted">{agency.name}</span>
            <Badge tone="primary">{job.type}</Badge>
            {agency.verified && <Badge tone="accent">Verified agency</Badge>}
          </div>
          <h3 className="mt-1.5 text-lg font-semibold text-ink leading-tight">
            {job.title}
          </h3>
          <p className="mt-2 text-sm text-muted line-clamp-2">{job.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
        <button
          aria-label="Open role"
          className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted group-hover:text-ink group-hover:bg-surface transition"
        >
          <ArrowUpRight size={16} />
        </button>
      </div>
      <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-sm">
        <Meta label="Comp" value={job.comp} mono />
        <Meta label="Commission" value={job.commission} mono />
        <Meta label="Location" value={`${job.remote} · ${job.region}`} icon={<MapPin size={12} />} />
        <Meta label="Posted" value={`${job.postedDays}d ago`} icon={<Clock size={12} />} />
      </div>
    </article>
  );
}

function Meta({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-subtle flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className={`text-sm text-ink mt-1 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
