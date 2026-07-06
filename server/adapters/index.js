// Adapter registry. Every external AI/trend service sits behind an interface
// with a working mock — the app runs fully offline-mockable before any key
// exists (spec §11). Real adapters activate automatically via env keys.
import { createMockLlmAdapter } from "./llm/mockLlm.js";
import { createAnthropicLlmAdapter } from "./llm/anthropicLlm.js";
import { createMockTrendAdapter } from "./trends/mockTrends.js";
import { createYouTubeTrendAdapter } from "./trends/youtubeTrends.js";
import { createMockVideoAdapter } from "./video/mockVideo.js";
import { createHiggsfieldVideoAdapter } from "./video/higgsfieldVideo.js";

export function buildAdapters() {
  const llm = process.env.ANTHROPIC_API_KEY
    ? createAnthropicLlmAdapter()
    : createMockLlmAdapter();

  const trendSources = [createMockTrendAdapter()];
  if (process.env.YOUTUBE_API_KEY) trendSources.unshift(createYouTubeTrendAdapter(process.env.YOUTUBE_API_KEY));

  const video = process.env.HIGGSFIELD_API_KEY
    ? createHiggsfieldVideoAdapter(process.env.HIGGSFIELD_API_KEY)
    : createMockVideoAdapter();

  console.log(`adapters: llm=${llm.name} trends=[${trendSources.map((t) => t.name).join(", ")}] video=${video.name}`);
  return { llm, trendSources, video };
}
