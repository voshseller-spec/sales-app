// Higgsfield VideoModel adapter (first-class option per spec §4.5).
// Activated when HIGGSFIELD_API_KEY is set. The operator's Higgsfield account
// is connected via MCP in the authoring environment; at runtime this adapter
// would call the Higgsfield generation API per scene, poll job status, then
// hand the clips to the assembly worker. Interface matches mockVideo exactly.
import { createMockVideoAdapter } from "./mockVideo.js";

export function createHiggsfieldVideoAdapter(apiKey) {
  const fallback = createMockVideoAdapter();
  return {
    name: "higgsfield",
    async render(job, onProgress) {
      // TODO(real integration): per-scene image gen -> motion gen via
      // Higgsfield API using `apiKey`, then ffmpeg assembly worker.
      // Until wired, delegate to the mock pipeline so the app never breaks.
      console.warn("higgsfield adapter: API not wired yet, using mock pipeline");
      return fallback.render(job, onProgress);
    },
  };
}
