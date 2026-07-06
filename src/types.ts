export interface ProductProfile {
  name: string;
  category: string;
  keyClaims: string[];
  allowedClaims: string[];
  images: string[];
  price: string;
  targetAudience: string;
  tone: string;
  complianceFlags: string[];
}

export type Goal = "energy" | "focus" | "daily-routine" | "before-after";

export type Momentum = "rising" | "peaking" | "cooling";

export interface TrendTemplate {
  id: string;
  name: string;
  momentum: Momentum;
  momentumScore: number;
  platforms: string[];
  niches: string[];
  goals: string[];
  hookPattern: string;
  structure: string[];
  pacing: string;
  audioStyle: string;
  onScreenTextStyle: string;
  whyItWorks: string;
  sources: string[];
  firstSeen: string;
  fitScore?: number;
  whyThisFits?: string;
}

export interface ScriptBeat {
  beat: "hook" | "problem" | "product-moment" | "proof" | "cta" | string;
  text: string;
}

export interface ScriptVariant {
  id: string;
  trendTemplateId: string | null;
  trendTemplateName: string;
  tone: string;
  hook: string;
  body: ScriptBeat[];
  estimatedDurationSec: number;
}

export type ShotType = "product-in-hand" | "b-roll" | "talking-actor" | "text-card";

export interface Scene {
  id: string;
  order: number;
  beat: string;
  shotType: ShotType;
  durationSec: number;
  sceneScript: string;
  visualPrompt: string;
  voiceoverText: string;
  onScreenText: string;
  cameraNote: string;
}

export interface ComplianceResult {
  passed: boolean;
  regulated: boolean;
  violations: { match: string | null; reason: string }[];
  warnings: { match: string | null; reason: string }[];
  disclaimer?: string | null;
}

export interface RenderManifestScene {
  id: string;
  shotType: ShotType;
  durationSec: number;
  caption: string;
  onScreenText: string;
  gradient: [string, string];
}

export interface RenderOutput {
  kind: "manifest" | "mp4";
  url?: string;
  ratio: string;
  watermark: boolean;
  totalDurationSec: number;
  productName: string;
  scenes: RenderManifestScene[];
}

export interface Render {
  id: string;
  status: "queued" | "rendering" | "done" | "failed";
  progressPct: number;
  stage: string;
  createdAt: string;
  ratio: string;
  watermark: boolean;
  modelTier: string;
  videoAdapter: string;
  product: { name: string; category: string };
  scriptId: string | null;
  trendTemplateId: string | null;
  trendTemplateName: string | null;
  sceneCount: number;
  compliance: ComplianceResult;
  costCredits: number;
  output: RenderOutput | null;
  performance?: PerformanceLog | null;
}

export interface PerformanceLog {
  views: number;
  ctr: number;
  spend: number;
  notes: string;
  loggedAt: string;
}

export interface Plan {
  id: string;
  label: string;
  price: string;
  rendersPerMonth: number;
  watermark: boolean;
  modelTier: string;
  trendAdaptation: boolean;
  exportRatios: string[];
  perks: string[];
}

export interface Usage {
  plan: Plan;
  plans: Plan[];
  used: number;
  limit: number;
}
