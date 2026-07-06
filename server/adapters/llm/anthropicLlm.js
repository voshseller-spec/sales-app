// Real LLM adapter (Anthropic). Activated automatically when
// ANTHROPIC_API_KEY is set. Prompt templates live in server/config/prompts.js
// so tone can be tuned without redeploying.
import Anthropic from "@anthropic-ai/sdk";
import { PROMPTS, fillTemplate } from "../../config/prompts.js";

function extractJson(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
  return JSON.parse(match[1].trim());
}

export function createAnthropicLlmAdapter() {
  const client = new Anthropic();
  const model = process.env.LLM_MODEL || "claude-sonnet-5";

  return {
    name: `anthropic:${model}`,

    async generateScripts({ product, goal, templates }) {
      const picked = (templates || []).slice(0, 3);
      const system = fillTemplate(PROMPTS.scriptSystem, {
        product_name: product.name,
        trend_hook_pattern: picked[0]?.hookPattern || "pattern of your choice",
        cta: "link below",
        duration: "30",
        key_claims: (product.keyClaims || []).join("; "),
        audience: product.targetAudience || "general social audience",
        allowed_claims: (product.allowedClaims || product.keyClaims || []).join("; "),
      });
      const user = `Product: ${JSON.stringify(product)}\nGoal: ${goal}\nTrend formats to map one variant each onto: ${picked
        .map((t) => (t ? `${t.name} (hook: ${t.hookPattern}; structure: ${t.structure.join(" → ")})` : "classic UGC"))
        .join(" | ")}\n\nReturn STRICT JSON: an array of 3 scripts, each {"trendTemplateName": string, "hook": string, "body": [{"beat": "hook|problem|product-moment|proof|cta", "text": string}], "estimatedDurationSec": number}. No prose outside the JSON.`;

      const res = await client.messages.create({
        model,
        max_tokens: 3000,
        system,
        messages: [{ role: "user", content: user }],
      });
      const scripts = extractJson(res.content.filter((b) => b.type === "text").map((b) => b.text).join(""));
      return scripts.map((s, i) => ({
        id: `script-${Date.now()}-${i}`,
        trendTemplateId: picked[i]?.id || null,
        trendTemplateName: s.trendTemplateName || picked[i]?.name || "Classic UGC",
        tone: "authentic-creator",
        hook: s.hook,
        body: s.body,
        estimatedDurationSec: s.estimatedDurationSec || 30,
      }));
    },

    async generateStoryboard({ product, script, template }) {
      const prompt = fillTemplate(PROMPTS.storyboard, {
        scene_count: "5",
        trend_template: template?.name || "classic UGC",
      });
      const user = `${prompt}\n\nScript: ${JSON.stringify(script)}\nProduct: ${product.name}\n\nReturn STRICT JSON array of scenes: [{"shotType": "product-in-hand|b-roll|talking-actor|text-card", "durationSec": number, "sceneScript": string, "visualPrompt": string, "voiceoverText": string, "onScreenText": string, "cameraNote": string}]. No prose outside the JSON.`;

      const res = await client.messages.create({
        model,
        max_tokens: 3000,
        messages: [{ role: "user", content: user }],
      });
      const scenes = extractJson(res.content.filter((b) => b.type === "text").map((b) => b.text).join(""));
      return scenes.map((s, i) => ({ id: `scene-${i + 1}`, order: i, beat: s.beat || "scene", ...s }));
    },
  };
}
