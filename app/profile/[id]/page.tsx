import { notFound } from "next/navigation";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Section, SectionHeader } from "@/components/ui/Section";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ScoreBreakdownPanel } from "@/components/profile/ScoreBreakdown";
import { reps } from "@/lib/mock";

export function generateStaticParams() {
  return reps.map((r) => ({ id: r.id }));
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const rep = reps.find((r) => r.id === params.id);
  if (!rep) notFound();

  return (
    <>
      <section className="border-b border-border bg-surface/40">
        <div className="container py-14 md:py-20">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Avatar src={rep.avatar} name={rep.name} size={112} className="border-2" />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">{rep.name}</h1>
                {rep.verified && <VerifiedBadge score={rep.score.overall} size="lg" />}
              </div>
              <p className="mt-2 text-lg text-muted max-w-2xl">{rep.headline}</p>
              <div className="mt-4 flex items-center gap-5 text-sm text-subtle flex-wrap">
                <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {rep.location}</span>
                <span className="inline-flex items-center gap-1.5"><Briefcase size={14} /> {rep.yearsExperience} years</span>
                <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> Available {rep.available.toLowerCase()}</span>
              </div>
              <div className="mt-5 flex gap-2 flex-wrap">
                {rep.motions.map((m) => <Badge key={m} tone="primary">{m}</Badge>)}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ScoreRing value={rep.score.overall} size={132} label="Closer Score" />
              <Button size="md">Request to match</Button>
            </div>
          </div>
        </div>
      </section>

      <Section className="py-14 md:py-20">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-ink">About</h2>
              <p className="mt-3 text-muted leading-relaxed">{rep.bio}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ink mb-4">Score breakdown</h2>
              <ScoreBreakdownPanel score={rep.score} />
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-elevated p-6 shadow-soft">
              <SectionHeader eyebrow="Track record" title="" align="left" />
              <div className="grid grid-cols-3 gap-3 -mt-8">
                <Stat label="Closed" value={String(rep.stats.closedDeals)} />
                <Stat label="Avg deal" value={rep.stats.avgDealSize} />
                <Stat label="Quota" value={`${rep.stats.quotaAttainmentPct}%`} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-elevated p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-ink mb-3">Industries</h3>
              <div className="flex gap-2 flex-wrap">
                {rep.industries.map((i) => <Badge key={i}>{i}</Badge>)}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-elevated p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-ink mb-3">Terms</h3>
              <dl className="text-sm space-y-2.5">
                <Row label="Ticket range" value={rep.ticketRange} />
                <Row label="Rate" value={rep.rate} />
                <Row label="Available" value={rep.available} />
              </dl>
            </div>
          </aside>
        </div>
      </Section>
    </>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <dt className="text-subtle">{label}</dt>
      <dd className="text-ink font-mono">{value}</dd>
    </div>
  );
}
