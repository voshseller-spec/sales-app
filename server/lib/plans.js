// Monetization tiers. Caps are enforced SERVER-SIDE in the render route —
// the UI usage meter is informational only.
export const PLANS = {
  free: {
    id: "free",
    label: "Free",
    price: "$0/mo",
    rendersPerMonth: 3,
    watermark: true,
    modelTier: "standard",
    trendAdaptation: false, // trends are view-only; "Make my version" upsells
    exportRatios: ["9:16"],
    perks: ["3 watermarked renders/mo", "Standard model tier", "Trends view-only"],
  },
  creator: {
    id: "creator",
    label: "Creator",
    price: "$29/mo",
    rendersPerMonth: 20,
    watermark: false,
    modelTier: "premium",
    trendAdaptation: true,
    exportRatios: ["9:16", "1:1", "16:9"],
    perks: ["20 renders/mo", "No watermark", "Premium video model", "Full trend adaptation", "All export ratios"],
  },
  pro: {
    id: "pro",
    label: "Pro / Agency",
    price: "$99/mo",
    rendersPerMonth: 100,
    watermark: false,
    modelTier: "premium",
    trendAdaptation: true,
    exportRatios: ["9:16", "1:1", "16:9"],
    perks: ["100 renders/mo", "Batch generation", "Multiple brand profiles", "Performance analytics", "Priority queue", "API access"],
  },
};
