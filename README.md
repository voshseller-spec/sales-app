# TrendForge UGC

> *Ride the trend before it peaks.*

Web-first AI UGC video ad platform with a real-time **Viral Trend Intelligence** engine. Not "make a UGC video" — it's "find what's working *right now* for products like mine, and generate my version in that exact format." Trend intelligence is the wedge; video generation is the commodity.

## Quick start

```bash
npm install
npm run build   # typecheck + build the frontend
npm start       # serve app + API on http://localhost:3000
```

Dev mode (Vite HMR on :5173, API on :3000):

```bash
npm run dev
```

**No API keys required.** Every AI/trend integration sits behind a swappable adapter with a working mock, so the app runs fully end-to-end offline. Copy `.env.example` to `.env` and add keys to flip adapters live:

| Key | Activates |
|---|---|
| `ANTHROPIC_API_KEY` | Real LLM script/storyboard generation (Claude) |
| `YOUTUBE_API_KEY` | YouTube Data API trend source (anchor source) |
| `HIGGSFIELD_API_KEY` | Higgsfield video model adapter |

## What's built (MVP vertical slice)

- **Create wizard** — product input (text / image upload / URL scrape with robots.txt respect + manual fallback) → goal → **trend match** (fit-scored formats with "why this fits") → 3 script variants in authentic creator voice → editable storyboard (reorder, per-scene regenerate, shot types) → async render with live progress → 9:16/1:1/16:9 preview + client-side video export (WebM in the MVP; MP4 arrives with real model adapters + ffmpeg worker).
- **Trends tab** — momentum-sorted card grid (rising / peaking / cooling), niche/platform/goal filters, trend-alert banner, one-tap **"Make my version."**
- **Gallery** — every render saved with its source trend, model, cost; **performance log** (views/CTR/spend) that feeds back into trend ranking (first-party signal).
- **Profile** — plans (Free / Creator / Pro), server-side usage caps, usage meter, live adapter status.
- **Compliance gate** — supplements/health/finance detected automatically; disease/cure/FDA claims block export (a gate, not a warning); FTC disclaimer surfaced.
- **PWA** — installable, offline app shell, theme-colored.

## Architecture

```
server/
  index.js              Express API + static SPA host
  adapters/
    llm/        mockLlm | anthropicLlm        (script + storyboard)
    trends/     mockTrends | youtubeTrends    (TrendSource: fetchTrends(niche) -> TrendSignal[])
    video/      mockVideo | higgsfieldVideo   (VideoModel: render(job, onProgress) -> output)
  lib/          queue (async render jobs), fitScore, compliance, product scraper, plans, db
  config/       prompts.js — editable prompt templates ({{vars}}), not hardcode
  data/         trendSeeds.js — seeded format templates
src/
  lib/api.ts    framework-agnostic service layer (ready for Capacitor/RN wrapper)
  lib/renderPaint.ts + exportVideo.ts   shared canvas painter → live player + MediaRecorder export
  store.ts      zustand wizard state
  pages/        Create · Trends · Gallery · Profile
```

**Non-negotiables honored:** every external service mockable · renders always async with visible progress · formats adapted, never creator content copied · licensed/royalty-free audio only · compliance gate before export · usage limits enforced server-side.

## Roadmap (per master build prompt)

1. ✅ MVP steps 1–6, 8–9 (auth stubbed as single-operator)
2. Real trend source (YouTube key) + real video model (Higgsfield/Seedance/Kling/Veo/Runway)
3. ffmpeg assembly worker → true MP4 export, TTS voiceover, music ducking
4. Supabase auth/DB/storage, BullMQ + Redis queue
5. Push notifications (trend alerts, render complete), Capacitor wrapper
