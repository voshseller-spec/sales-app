"use client";

import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";

export function FilterBar({
  query,
  onQuery,
  type,
  onType,
  remote,
  onRemote,
}: {
  query: string;
  onQuery: (v: string) => void;
  type: string;
  onType: (v: string) => void;
  remote: string;
  onRemote: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-elevated p-3 shadow-soft grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-2">
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search roles, agencies, verticals…"
          className="pl-10"
        />
      </div>
      <Select value={type} onChange={(e) => onType(e.target.value)}>
        <option value="">All role types</option>
        <option value="Closer">Closer</option>
        <option value="SDR">SDR</option>
        <option value="Full-cycle AE">Full-cycle AE</option>
        <option value="Founding AE">Founding AE</option>
      </Select>
      <Select value={remote} onChange={(e) => onRemote(e.target.value)}>
        <option value="">Any location</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
        <option value="On-site">On-site</option>
      </Select>
    </div>
  );
}
