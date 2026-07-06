// ProductProfile normalization. Three input modes (text / image / URL) all
// normalize into one shape:
// { name, category, keyClaims[], images[], price, targetAudience, tone, complianceFlags[] }
import { detectComplianceFlags } from "./compliance.js";

const CATEGORY_HINTS = [
  { re: /\b(supplement|vitamin|caffeine|pill|capsule|nootropic|creatine|gummies|protein)\b/i, cat: "supplements" },
  { re: /\b(serum|skincare|moisturizer|makeup|cleanser|spf)\b/i, cat: "beauty" },
  { re: /\b(workout|gym|fitness|resistance|dumbbell|yoga)\b/i, cat: "fitness" },
  { re: /\b(study|productivity|planner|notebook|focus timer)\b/i, cat: "study" },
  { re: /\b(gadget|charger|earbuds|tracker|smart)\b/i, cat: "gadgets" },
  { re: /\b(invest|trading|budget|credit|savings)\b/i, cat: "finance" },
];

export function detectCategory(text) {
  for (const { re, cat } of CATEGORY_HINTS) if (re.test(text)) return cat;
  return "lifestyle";
}

export function normalizeProduct(input = {}) {
  const text = [input.name, input.description, ...(input.keyClaims || [])].filter(Boolean).join(" ");
  const category = input.category || detectCategory(text);
  return {
    name: (input.name || "").trim() || "My Product",
    category,
    keyClaims: (input.keyClaims || []).map((c) => String(c).trim()).filter(Boolean).slice(0, 8),
    allowedClaims: (input.allowedClaims || input.keyClaims || []).map((c) => String(c).trim()).filter(Boolean),
    images: (input.images || []).slice(0, 5),
    price: input.price || "",
    targetAudience: input.targetAudience || "",
    tone: input.tone || "casual-authentic",
    complianceFlags: [...new Set([...(category === "supplements" ? ["supplements"] : []), ...detectComplianceFlags(text)])],
  };
}

async function robotsAllows(url) {
  try {
    const u = new URL(url);
    const res = await fetch(`${u.origin}/robots.txt`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return true;
    const txt = await res.text();
    // Minimal check: honor a global Disallow for the fetched path.
    let inStar = false;
    for (const raw of txt.split("\n")) {
      const line = raw.trim().toLowerCase();
      if (line.startsWith("user-agent:")) inStar = line.includes("*");
      if (inStar && line.startsWith("disallow:")) {
        const path = line.slice("disallow:".length).trim();
        if (path === "/" || (path && u.pathname.startsWith(path))) return false;
      }
    }
    return true;
  } catch {
    return true;
  }
}

const UAS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
];

function meta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i");
  return html.match(re)?.[1] || html.match(alt)?.[1] || "";
}

/**
 * Server-side URL scrape: title, hero image, description, price.
 * Respects robots.txt; NEVER hard-depends on success — callers always fall
 * back to manual entry ({ fallback: true }).
 */
export async function scrapeProductUrl(url) {
  try {
    if (!(await robotsAllows(url))) return { fallback: true, reason: "Blocked by the site's robots.txt — enter details manually." };
    const res = await fetch(url, {
      headers: { "User-Agent": UAS[Math.floor(Math.random() * UAS.length)], Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    if (!res.ok) return { fallback: true, reason: `Site returned ${res.status} — enter details manually.` };
    const html = (await res.text()).slice(0, 500_000);

    const name = meta(html, "og:title") || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || "";
    const description = meta(html, "og:description") || meta(html, "description");
    const image = meta(html, "og:image");
    const price =
      meta(html, "product:price:amount") ||
      meta(html, "og:price:amount") ||
      html.match(/[$€£]\s?(\d{1,4}(?:[.,]\d{2})?)/)?.[0] ||
      "";

    if (!name) return { fallback: true, reason: "Couldn't extract product details — enter them manually." };
    return {
      fallback: false,
      product: {
        name,
        description,
        keyClaims: description ? [description.slice(0, 140)] : [],
        images: image ? [image] : [],
        price,
      },
    };
  } catch (err) {
    return { fallback: true, reason: `Fetch failed (${err.message}) — enter details manually.` };
  }
}
