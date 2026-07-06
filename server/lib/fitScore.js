// Match trend templates to a ProductProfile + goal: compute a fit score and a
// plain-English "why this fits" (spec §4.4 step 3).

export function scoreTemplate(template, product, goal) {
  let score = 0;
  const reasons = [];

  const niche = (product?.category || "").toLowerCase();
  if (template.niches.includes(niche)) {
    score += 35;
    reasons.push(`proven in the ${niche} niche`);
  } else if (niche) {
    score += 10;
  }

  if (goal && template.goals.includes(goal)) {
    score += 30;
    reasons.push(`built for ${goal.replace("-", " ")} angles`);
  }

  score += Math.round(template.momentumScore * 0.3);
  if (template.momentum === "rising") reasons.push("momentum is rising — early window");
  if (template.momentum === "peaking") reasons.push("peaking right now — maximum reach window");
  if (template.momentum === "cooling") reasons.push("past its peak — lower reach, but cheap to test");

  // First-party feedback loop: bias toward formats that actually converted
  // for this operator (spec §4.7).
  if (template._firstPartyWins > 0) {
    score += Math.min(template._firstPartyWins * 5, 15);
    reasons.push("performed well in your own logged results");
  }

  return {
    fitScore: Math.min(Math.round(score), 99),
    whyThisFits: reasons.length
      ? `This format ${reasons.join(", ")}.`
      : "General-purpose format — a safe baseline test.",
  };
}

export function rankTemplates(templates, product, goal, { limit = 6 } = {}) {
  return templates
    .map((t) => ({ ...t, ...scoreTemplate(t, product, goal) }))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, limit);
}
