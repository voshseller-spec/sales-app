"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/jobs/FilterBar";
import { JobCard } from "@/components/jobs/JobCard";
import { agencies, jobs } from "@/lib/mock";

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [remote, setRemote] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return jobs.filter((j) => {
      const ag = agencies.find((a) => a.id === j.agencyId);
      const matchesQ =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        ag?.name.toLowerCase().includes(q) ||
        ag?.vertical.toLowerCase().includes(q);
      const matchesType = !type || j.type === type;
      const matchesRemote = !remote || j.remote === remote;
      return matchesQ && matchesType && matchesRemote;
    });
  }, [query, type, remote]);

  return (
    <div className="container py-14 md:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">Open roles</h1>
        <p className="mt-3 text-muted">
          Roles posted by verified AI agencies. Apply with your Closer Score — no resume needed.
        </p>
      </div>

      <div className="mt-8">
        <FilterBar
          query={query} onQuery={setQuery}
          type={type} onType={setType}
          remote={remote} onRemote={setRemote}
        />
      </div>

      <div className="mt-6 text-sm text-subtle">
        Showing <span className="text-ink font-medium">{filtered.length}</span> of {jobs.length} roles
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {filtered.map((j) => {
          const ag = agencies.find((a) => a.id === j.agencyId)!;
          return <JobCard key={j.id} job={j} agency={ag} />;
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted">
            No roles match those filters. Try clearing one.
          </div>
        )}
      </div>
    </div>
  );
}
