// Prompt templates — editable config, not hardcode (§7 of the spec).
// Variables use {{braces}} and are filled by fillTemplate().

export const PROMPTS = {
  scriptSystem: `You are a real micro-creator making an unpolished, believable UGC video about {{product_name}}. Speak first-person, casual, slightly imperfect. No corporate ad language, no hype words like "revolutionary." Open with a scroll-stopping hook in the first 3 seconds using the "{{trend_hook_pattern}}" pattern. Structure: hook → relatable problem → natural product moment → concrete benefit → soft CTA ("{{cta}}"). Keep it under {{duration}}s of spoken words. Product context: {{key_claims}}. Audience: {{audience}}. Avoid any health claim not in {{allowed_claims}}.`,

  storyboard: `Break this script into {{scene_count}} scenes. For each: shotType (product-in-hand | b-roll | talking-actor | text-card), 1-2s hook scene first, visualPrompt (concrete, filmable), voiceoverText, onScreenText (short, punchy), cameraNote. Match the pacing of the "{{trend_template}}" format.`,

  trendAdaptation: `Given trend format "{{template_name}}" (structure: {{template_structure}}, hook: {{template_hook}}, pacing: {{template_pacing}}), rewrite the ad for {{product_name}} so it authentically fits this format without copying any specific creator's exact words or footage.`,
};

export function fillTemplate(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{{${k}}}`));
}
