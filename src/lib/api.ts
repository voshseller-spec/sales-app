// Framework-agnostic API service layer (spec §2: business logic lives in
// services, not components — ready for a Capacitor/RN wrapper).
import type {
  ComplianceResult,
  ProductProfile,
  Render,
  Scene,
  ScriptVariant,
  TrendTemplate,
  Usage,
} from "../types";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data.code);
  return data as T;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const api = {
  normalizeProduct: (input: Partial<ProductProfile> & { description?: string }) =>
    req<{ product: ProductProfile }>("/api/product/normalize", { method: "POST", body: JSON.stringify(input) }),

  scrapeProduct: (url: string) =>
    req<{ fallback: boolean; reason?: string; product?: ProductProfile }>("/api/product/scrape", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),

  trends: (filters?: { niche?: string; platform?: string; goal?: string }) => {
    const qs = new URLSearchParams(Object.entries(filters || {}).filter(([, v]) => v && v !== "all") as [string, string][]);
    return req<{ templates: TrendTemplate[]; sources: string[] }>(`/api/trends?${qs}`);
  },

  matchTrends: (product: ProductProfile, goal: string) =>
    req<{ matches: TrendTemplate[] }>("/api/trends/match", { method: "POST", body: JSON.stringify({ product, goal }) }),

  generateScripts: (product: ProductProfile, goal: string, templateIds?: string[]) =>
    req<{ scripts: ScriptVariant[]; llm: string }>("/api/scripts", {
      method: "POST",
      body: JSON.stringify({ product, goal, templateIds }),
    }),

  generateStoryboard: (product: ProductProfile, script: ScriptVariant, templateId?: string | null) =>
    req<{ scenes: Scene[] }>("/api/storyboard", {
      method: "POST",
      body: JSON.stringify({ product, script, templateId }),
    }),

  checkCompliance: (text: string, category: string, allowedClaims: string[]) =>
    req<ComplianceResult & { disclaimer: string | null }>("/api/compliance/check", {
      method: "POST",
      body: JSON.stringify({ text, category, allowedClaims }),
    }),

  startRender: (payload: {
    product: ProductProfile;
    scenes: Scene[];
    scriptId?: string | null;
    trendTemplateId?: string | null;
    trendTemplateName?: string | null;
    ratio?: string;
  }) => req<{ render: Render }>("/api/renders", { method: "POST", body: JSON.stringify(payload) }),

  getRender: (id: string) => req<{ render: Render }>(`/api/renders/${id}`),
  listRenders: () => req<{ renders: Render[] }>("/api/renders"),

  logPerformance: (id: string, log: { views: number; ctr: number; spend: number; notes: string }) =>
    req<{ ok: boolean }>(`/api/renders/${id}/performance`, { method: "POST", body: JSON.stringify(log) }),

  usage: () => req<Usage>("/api/usage"),
  setPlan: (plan: string) => req<{ ok: boolean }>("/api/usage/plan", { method: "POST", body: JSON.stringify({ plan }) }),
};
