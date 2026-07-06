// Mock TrendSource adapter — realistic seed templates so the trend engine
// works end-to-end before any API key exists.
// Interface: fetchTrends(niche, window) -> TrendSignal[]
import { trendSeeds } from "../../data/trendSeeds.js";

export function createMockTrendAdapter() {
  return {
    name: "mock-trends",
    async fetchTrends(niche = "all") {
      if (niche === "all") return trendSeeds;
      return trendSeeds.filter((t) => t.niches.includes(niche));
    },
  };
}
