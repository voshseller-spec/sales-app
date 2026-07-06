import { useState } from "react";
import type { TrendTemplate } from "../types";
import { Badge, Button, MomentumBadge } from "./ui";

export default function TrendCard({
  trend,
  onMakeMyVersion,
  locked,
}: {
  trend: TrendTemplate;
  onMakeMyVersion?: (t: TrendTemplate) => void;
  locked?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card card-hover flex flex-col p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-white">{trend.name}</h3>
        <MomentumBadge momentum={trend.momentum} />
      </div>

      {/* Mini example: the hook pattern styled like an on-screen caption */}
      <div className="mb-3 rounded-lg bg-black/40 px-3 py-2.5 text-[13px] font-semibold italic text-mist-100">
        "{trend.hookPattern}"
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {typeof trend.fitScore === "number" && <Badge tone="ember">fit {trend.fitScore}%</Badge>}
        <Badge>momentum {trend.momentumScore}</Badge>
        {trend.platforms.map((p) => (
          <Badge key={p}>{p}</Badge>
        ))}
      </div>

      <p className="mb-3 line-clamp-3 text-[13px] leading-relaxed text-mist-300">
        {trend.whyThisFits || trend.whyItWorks}
      </p>

      {open && (
        <div className="mb-3 space-y-2 rounded-lg bg-black/30 p-3 text-[12px] text-mist-300">
          <div>
            <span className="font-semibold text-mist-100">Structure:</span>
            <ol className="ml-4 mt-1 list-decimal space-y-0.5">
              {trend.structure.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
          <div><span className="font-semibold text-mist-100">Pacing:</span> {trend.pacing}</div>
          <div><span className="font-semibold text-mist-100">Audio:</span> {trend.audioStyle}</div>
          <div><span className="font-semibold text-mist-100">On-screen text:</span> {trend.onScreenTextStyle}</div>
          <div className="border-t border-white/10 pt-2 text-[11px] text-mist-500">
            Signal sources: {trend.sources.join(" · ")} — formats adapted, never copied.
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center gap-2">
        {onMakeMyVersion && (
          <Button onClick={() => onMakeMyVersion(trend)} className="flex-1" title={locked ? "Trend adaptation requires Creator plan — you can still build manually" : undefined}>
            {locked ? "🔒 " : "⚡ "}Make my version
          </Button>
        )}
        <Button variant="ghost" onClick={() => setOpen((o) => !o)}>
          {open ? "Less" : "Details"}
        </Button>
      </div>
    </div>
  );
}
