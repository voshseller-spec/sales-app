// Create-wizard state. Zustand keeps it framework-light and outside components.
import { create } from "zustand";
import type { ProductProfile, Render, Scene, ScriptVariant, TrendTemplate } from "./types";

export type WizardStep = "product" | "goal" | "trend" | "script" | "storyboard" | "render";

export const STEP_ORDER: WizardStep[] = ["product", "goal", "trend", "script", "storyboard", "render"];

interface WizardState {
  step: WizardStep;
  product: ProductProfile | null;
  goal: string;
  trend: TrendTemplate | null;
  scripts: ScriptVariant[];
  script: ScriptVariant | null;
  scenes: Scene[];
  render: Render | null;

  setStep: (s: WizardStep) => void;
  setProduct: (p: ProductProfile) => void;
  setGoal: (g: string) => void;
  setTrend: (t: TrendTemplate | null) => void;
  setScripts: (s: ScriptVariant[]) => void;
  setScript: (s: ScriptVariant) => void;
  setScenes: (s: Scene[]) => void;
  setRender: (r: Render | null) => void;
  /** Start the wizard pre-loaded with a trend ("Make my version"). */
  startFromTrend: (t: TrendTemplate) => void;
  reset: () => void;
}

const initial = {
  step: "product" as WizardStep,
  product: null,
  goal: "",
  trend: null,
  scripts: [],
  script: null,
  scenes: [],
  render: null,
};

export const useWizard = create<WizardState>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setProduct: (product) => set({ product }),
  setGoal: (goal) => set({ goal }),
  setTrend: (trend) => set({ trend }),
  setScripts: (scripts) => set({ scripts }),
  setScript: (script) => set({ script }),
  setScenes: (scenes) => set({ scenes }),
  setRender: (render) => set({ render }),
  startFromTrend: (trend) => set({ ...initial, trend, step: "product" }),
  reset: () => set({ ...initial }),
}));
