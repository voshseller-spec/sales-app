// Compliance gate for regulated verticals (supplements, health, finance).
// Runs before every render is marked exportable — a gate, not an afterthought.

const REGULATED_CATEGORIES = ["supplements", "health", "finance"];

// Disease/cure claim patterns that violate FTC substantiation rules and
// Meta/TikTok supplement ad policies.
const BLOCKED_PATTERNS = [
  { re: /\b(cure[sd]?|curing)\b/i, reason: "Cure claims are prohibited for supplements." },
  { re: /\btreat(s|ed|ment)?\b/i, reason: "Treatment claims require drug approval — not allowed for supplements." },
  { re: /\bheal(s|ed|ing)?\b/i, reason: "Healing claims are prohibited." },
  { re: /\bprevent(s|ed|ion)?\b.{0,30}\b(disease|illness|cancer|covid|flu)\b/i, reason: "Disease-prevention claims are prohibited." },
  { re: /\b(cancer|diabetes|depression|anxiety|adhd|alzheimer|arthritis|covid)\b/i, reason: "Naming medical conditions implies a disease claim." },
  { re: /\bfda[- ]approved\b/i, reason: "Supplements are not FDA-approved; this claim is false/misleading." },
  { re: /\b(lose|lost)\s+\d+\s*(lbs?|pounds?|kg|kilos?)\b/i, reason: "Specific weight-loss amount claims violate ad policies." },
  { re: /\bguaranteed?\s+(results?|to work)\b/i, reason: "Guaranteed-results claims lack substantiation." },
  { re: /\b(clinically proven|doctors? recommend)\b/i, reason: "Requires documented substantiation before use in ads." },
];

const WARN_PATTERNS = [
  { re: /\b(boost[s]?|increase[s]?)\s+(your\s+)?(immunity|immune)\b/i, reason: "Immunity claims draw platform review — soften to 'supports'." },
  { re: /\binstant(ly)?\b/i, reason: "'Instant' effect claims often get flagged — consider 'fast' or a timeframe you can support." },
  { re: /\bbest\s+(supplement|product)\s+(ever|on the market)\b/i, reason: "Superlative claims may require substantiation." },
];

export function isRegulated(category) {
  return REGULATED_CATEGORIES.includes((category || "").toLowerCase());
}

export function detectComplianceFlags(text) {
  const t = (text || "").toLowerCase();
  const flags = [];
  if (/\b(supplement|vitamin|caffeine|pill|capsule|nootropic|creatine|protein powder|gummies)\b/.test(t)) flags.push("supplements");
  if (/\b(health|wellness|immune|sleep aid|pain relief)\b/.test(t)) flags.push("health");
  if (/\b(invest|trading|crypto|loan|credit|finance)\b/.test(t)) flags.push("finance");
  return [...new Set(flags)];
}

/**
 * Check ad copy against the compliance rules.
 * @param {string} text - full script / caption text
 * @param {object} opts - { category, allowedClaims: string[] }
 * @returns {{passed: boolean, regulated: boolean, violations: [], warnings: []}}
 */
export function checkCompliance(text, { category, allowedClaims = [] } = {}) {
  const regulated = isRegulated(category);
  const violations = [];
  const warnings = [];

  if (regulated) {
    for (const { re, reason } of BLOCKED_PATTERNS) {
      const m = (text || "").match(re);
      if (m) violations.push({ match: m[0], reason });
    }
    for (const { re, reason } of WARN_PATTERNS) {
      const m = (text || "").match(re);
      if (m) warnings.push({ match: m[0], reason });
    }
    warnings.push({
      match: null,
      reason: "Regulated vertical — review before you run this as a paid ad. Platforms reject or ban non-compliant supplement ads.",
    });
    if (allowedClaims.length) {
      warnings.push({
        match: null,
        reason: `Allowed-claims allowlist active (${allowedClaims.length} claims). Anything beyond the allowlist needs substantiation.`,
      });
    }
  }

  return { passed: violations.length === 0, regulated, violations, warnings };
}

export const DISCLAIMER =
  "*These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.";
