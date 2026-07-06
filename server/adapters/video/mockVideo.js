// Mock VideoModel adapter. Simulates the real pipeline stage-by-stage
// (image gen → motion → voiceover → assembly → captions) with realistic
// timing, and produces a render MANIFEST the client plays in a 9:16 player
// and can export client-side. Real adapters (Higgsfield/Seedance/Kling/Veo/
// Runway) return actual MP4 URLs through the same interface.

const SHOT_GRADIENTS = {
  "talking-actor": ["#3b1220", "#12060c"],
  "b-roll": ["#1a1030", "#0a0614"],
  "product-in-hand": ["#40170f", "#140704"],
  "text-card": ["#20060e", "#050203"],
};

const STAGES = [
  { key: "image", label: "Generating first frames", weight: 25 },
  { key: "motion", label: "Rendering motion", weight: 35 },
  { key: "voiceover", label: "Synthesizing voiceover", weight: 15 },
  { key: "assembly", label: "Assembling scenes", weight: 15 },
  { key: "captions", label: "Timing captions & music ducking", weight: 10 },
];

export function createMockVideoAdapter() {
  return {
    name: "mock-video",

    /**
     * Simulate a render. Calls onProgress({pct, stage}) as it advances,
     * resolves with the output manifest.
     */
    async render({ scenes, product, watermark, ratio = "9:16" }, onProgress) {
      let pct = 0;
      for (const stage of STAGES) {
        const ticks = 4;
        for (let i = 1; i <= ticks; i++) {
          await new Promise((r) => setTimeout(r, 350 + Math.random() * 300));
          pct += stage.weight / ticks;
          onProgress({ pct: Math.min(Math.round(pct), 99), stage: stage.label });
        }
      }

      return {
        kind: "manifest", // real adapters return { kind: "mp4", url }
        ratio,
        watermark: !!watermark,
        totalDurationSec: scenes.reduce((s, sc) => s + (sc.durationSec || 4), 0),
        productName: product?.name || "",
        scenes: scenes.map((sc) => ({
          id: sc.id,
          shotType: sc.shotType,
          durationSec: sc.durationSec || 4,
          caption: sc.voiceoverText || sc.sceneScript || "",
          onScreenText: sc.onScreenText || "",
          gradient: SHOT_GRADIENTS[sc.shotType] || SHOT_GRADIENTS["b-roll"],
        })),
      };
    },
  };
}
