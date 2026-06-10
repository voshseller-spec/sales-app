import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

export type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function FeatureGrid({
  eyebrow,
  title,
  description,
  features,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  features: Feature[];
}) {
  return (
    <Section>
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-elevated p-6 shadow-soft hover:shadow-lift transition"
          >
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary mb-4">
              <f.icon size={16} />
            </div>
            <h3 className="text-base font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
