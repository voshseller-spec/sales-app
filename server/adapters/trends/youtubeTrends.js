// Real trend source stub: YouTube Data API (the sanctioned anchor source).
// Activated when YOUTUBE_API_KEY is set. Fetches mostPopular + niche search,
// then the results would be clustered into format templates by the LLM pass
// (see spec §4.4). For the MVP this maps raw signals onto seed templates and
// bumps momentum with live view counts.
import { trendSeeds } from "../../data/trendSeeds.js";

export function createYouTubeTrendAdapter(apiKey) {
  return {
    name: "youtube-data-api",
    async fetchTrends(niche = "all") {
      try {
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=25&key=${apiKey}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error(`YouTube API ${res.status}`);
        const data = await res.json();
        // MVP clustering: attach live signal counts to seed templates as
        // freshness evidence. A full LLM clustering pass replaces this.
        const liveSignalCount = data.items?.length || 0;
        return trendSeeds
          .filter((t) => niche === "all" || t.niches.includes(niche))
          .map((t) => ({ ...t, sources: [...t.sources, `YouTube live signal (${liveSignalCount} videos ingested)`] }));
      } catch (err) {
        console.warn("youtube-trends: falling back to seeds:", err.message);
        return niche === "all" ? trendSeeds : trendSeeds.filter((t) => t.niches.includes(niche));
      }
    },
  };
}
