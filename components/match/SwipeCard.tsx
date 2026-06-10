"use client";

import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Briefcase, MapPin, TrendingUp } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { Rep } from "@/lib/types";

export function SwipeCard({
  rep,
  onSwipe,
  isTop,
  index,
}: {
  rep: Rep;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
  index: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const passOpacity = useTransform(x, [-150, -40, 0], [1, 0.4, 0]);
  const likeOpacity = useTransform(x, [0, 40, 150], [0, 0.4, 1]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120) onSwipe("right");
    else if (info.offset.x < -120) onSwipe("left");
  };

  return (
    <motion.article
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, zIndex: 10 - index }}
      animate={{
        scale: 1 - index * 0.04,
        y: index * 10,
        opacity: index > 2 ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="absolute inset-x-0 mx-auto w-full max-w-md rounded-2xl bg-elevated border border-border shadow-lift overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute top-6 left-6 z-20 rotate-[-12deg] rounded-md border-2 border-accent text-accent px-3 py-1 font-bold tracking-wider"
      >
        MATCH
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute top-6 right-6 z-20 rotate-[12deg] rounded-md border-2 border-danger text-danger px-3 py-1 font-bold tracking-wider"
      >
        PASS
      </motion.div>

      <div className="p-6 flex items-start gap-4">
        <Avatar src={rep.avatar} name={rep.name} size={56} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-ink truncate">{rep.name}</h3>
            {rep.verified && <VerifiedBadge score={rep.score.overall} size="sm" />}
          </div>
          <p className="mt-1 text-sm text-muted line-clamp-2">{rep.headline}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-subtle">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {rep.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase size={12} /> {rep.yearsExperience}y exp
            </span>
          </div>
        </div>
        <ScoreRing value={rep.score.overall} size={68} label="Score" />
      </div>

      <div className="px-6 pb-5">
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Stat label="Closed" value={String(rep.stats.closedDeals)} />
          <Stat label="Avg deal" value={rep.stats.avgDealSize} />
          <Stat label="Quota" value={`${rep.stats.quotaAttainmentPct}%`} />
        </div>
      </div>

      <div className="px-6 pb-5">
        <div className="text-xs uppercase tracking-wider text-subtle mb-2">Industries</div>
        <div className="flex flex-wrap gap-1.5">
          {rep.industries.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>

      <div className="px-6 pb-5">
        <div className="text-xs uppercase tracking-wider text-subtle mb-2">Score breakdown</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
          <ScoreBar label="Discovery" value={rep.score.discovery} />
          <ScoreBar label="Objections" value={rep.score.objectionHandling} />
          <ScoreBar label="Closing" value={rep.score.closing} />
          <ScoreBar label="Talk ratio" value={rep.score.talkRatio} />
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border bg-surface/40 flex items-center justify-between text-xs">
        <span className="text-muted">
          <span className="text-subtle">Rate</span> {rep.rate}
        </span>
        <span className="inline-flex items-center gap-1 text-accent font-medium">
          <TrendingUp size={12} /> {rep.available}
        </span>
      </div>
    </motion.article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface/50 p-3">
      <div className="text-[10px] uppercase tracking-wider text-subtle">{label}</div>
      <div className="font-mono text-base text-ink font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const tone = value >= 90 ? "bg-accent" : value >= 80 ? "bg-primary" : "bg-warning";
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-muted">{label}</span>
        <span className="text-ink">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
