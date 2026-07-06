// Mock LLM adapter — template-driven generation with realistic seed output so
// the full flow works before any API key exists. Same interface as the
// Anthropic adapter: generateScripts() and generateStoryboard().

const HOOK_LINES = {
  energy: [
    "ok so I did NOT expect this to work",
    "me realizing my 3rd coffee was the problem, not the fix",
    "if you hit a wall at 2pm every day, watch this",
  ],
  focus: [
    "I used to reread the same paragraph five times",
    "my screen time report was embarrassing until I fixed this",
    "this is how I finally got 3 deep-work hours back",
  ],
  "daily-routine": [
    "adding one thing to my morning changed the whole day",
    "my routine was a mess until I stopped overcomplicating it",
    "the 10-second habit I refuse to skip now",
  ],
  "before-after": [
    "week 1 vs week 4 — I have receipts",
    "I documented everything so you don't have to guess",
    "the before was rough, I'm not gonna lie",
  ],
};

const PROBLEM_LINES = {
  energy: "Every afternoon I'd just crash — like someone unplugged me at 2pm. More coffee just made me jittery AND tired, which is honestly impressive.",
  focus: "I'd sit down to work and twenty minutes later I'm on my phone with zero memory of picking it up. My focus was cooked.",
  "daily-routine": "My mornings were chaos — snooze three times, skip breakfast, feel behind before 9am. Something had to give.",
  "before-after": "A month ago I was running on fumes, snapping at people, and blaming everything except the obvious.",
};

const PROOF_LINES = {
  energy: "It's been two weeks and the 2pm wall just... isn't there. Not wired — just steady, which is what I actually wanted.",
  focus: "First time in months I've done a full deep-work block without touching my phone. I checked twice whether my wifi was off. It wasn't. That was just me.",
  "daily-routine": "It's one step, ten seconds, and my whole morning stopped feeling like a fire drill.",
  "before-after": "Four weeks in: mornings are fine, afternoons are fine, and my group chat noticed before I did.",
};

function pick(arr, i) {
  return arr[i % arr.length];
}

function makeScript(product, goal, template, variantIndex) {
  const g = HOOK_LINES[goal] ? goal : "energy";
  const hook = template?.hookPattern
    ? template.hookPattern
        .replace("{{topic}}", product.category || "this")
        .replace("{{event}}", "a long day")
        .replace("{{persona}}", product.targetAudience || "someone who's always tired")
    : pick(HOOK_LINES[g], variantIndex);
  const claim = product.keyClaims?.[variantIndex % Math.max(product.keyClaims?.length || 1, 1)] || "it just works";

  return {
    id: `script-${Date.now()}-${variantIndex}`,
    trendTemplateId: template?.id || null,
    trendTemplateName: template?.name || "Classic UGC",
    tone: "authentic-creator",
    hook,
    body: [
      { beat: "hook", text: hook },
      { beat: "problem", text: pick([PROBLEM_LINES[g]], 0) },
      {
        beat: "product-moment",
        text: `So a friend put me onto ${product.name}. I was skeptical — I've tried stuff like this before — but it fit into what I already do, so I gave it two weeks.`,
      },
      { beat: "proof", text: `${PROOF_LINES[g]} The main thing for me: ${String(claim).toLowerCase()}.` },
      {
        beat: "cta",
        text: `Not saying it'll fix your life, but if this sounds like you, it's linked below. Try it and tell me I'm wrong.`,
      },
    ],
    estimatedDurationSec: 28 + variantIndex * 4,
  };
}

const SCENE_DEFAULTS = {
  hook: { shotType: "talking-actor", durationSec: 2, cameraNote: "handheld selfie, eye-level, tight crop" },
  problem: { shotType: "b-roll", durationSec: 6, cameraNote: "moody desk/afternoon-slump b-roll, slow push-in" },
  "product-moment": { shotType: "product-in-hand", durationSec: 7, cameraNote: "natural window light, product label readable at center frame" },
  proof: { shotType: "talking-actor", durationSec: 8, cameraNote: "brighter grade than the problem beat — visual before/after" },
  cta: { shotType: "text-card", durationSec: 4, cameraNote: "end card, product shot + one-line CTA" },
};

function shortOverlay(beat, text) {
  if (beat === "hook") return text.length > 40 ? text.slice(0, 38) + "…" : text;
  if (beat === "cta") return "link below ↓";
  if (beat === "product-moment") return "the switch ➜";
  if (beat === "proof") return "week 2 update";
  return "";
}

export function createMockLlmAdapter() {
  return {
    name: "mock-llm",

    async generateScripts({ product, goal, templates }) {
      // 3 variants, each mapped to a different trend format
      const picked = (templates || []).slice(0, 3);
      while (picked.length < 3) picked.push(null);
      return picked.map((t, i) => makeScript(product, goal, t, i));
    },

    async generateStoryboard({ product, script, template }) {
      return script.body.map((beat, i) => {
        const d = SCENE_DEFAULTS[beat.beat] || SCENE_DEFAULTS.proof;
        return {
          id: `scene-${i + 1}`,
          order: i,
          beat: beat.beat,
          shotType: d.shotType,
          durationSec: beat.beat === "hook" ? 2 : d.durationSec,
          sceneScript: beat.text,
          visualPrompt:
            beat.beat === "product-in-hand" || d.shotType === "product-in-hand"
              ? `Close-up of a hand holding ${product.name}, ${d.cameraNote}, vertical 9:16, natural UGC look, slight handheld shake`
              : `${d.shotType === "text-card" ? "Clean text card, dark gradient background" : "Authentic UGC-style shot"}: ${beat.text.slice(0, 90)}. ${d.cameraNote}. Vertical 9:16.`,
          voiceoverText: beat.text,
          onScreenText: shortOverlay(beat.beat, beat.text),
          cameraNote: d.cameraNote + (template?.pacing ? ` · pacing: ${template.pacing}` : ""),
        };
      });
    },
  };
}
