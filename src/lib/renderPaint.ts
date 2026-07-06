// Shared scene-painting logic for the live preview player and the client-side
// video exporter. Draws one frame of a render manifest onto a canvas 2D ctx.
import type { RenderOutput, RenderManifestScene } from "../types";

export const RATIOS: Record<string, { w: number; h: number }> = {
  "9:16": { w: 720, h: 1280 },
  "1:1": { w: 960, h: 960 },
  "16:9": { w: 1280, h: 720 },
};

const SHOT_LABELS: Record<string, string> = {
  "talking-actor": "TALKING ACTOR",
  "b-roll": "B-ROLL",
  "product-in-hand": "PRODUCT IN HAND",
  "text-card": "TEXT CARD",
};

export function sceneAt(output: RenderOutput, tSec: number): { scene: RenderManifestScene; local: number; index: number } {
  let acc = 0;
  for (let i = 0; i < output.scenes.length; i++) {
    const s = output.scenes[i];
    if (tSec < acc + s.durationSec) return { scene: s, local: tSec - acc, index: i };
    acc += s.durationSec;
  }
  const last = output.scenes.length - 1;
  return { scene: output.scenes[last], local: output.scenes[last].durationSec, index: last };
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export function paintFrame(ctx: CanvasRenderingContext2D, output: RenderOutput, tSec: number, w: number, h: number) {
  const { scene, local, index } = sceneAt(output, tSec);

  // Background gradient with a slow zoom to fake motion
  const zoom = 1 + (local / Math.max(scene.durationSec, 1)) * 0.06;
  const grad = ctx.createLinearGradient(0, 0, w * zoom, h * zoom);
  grad.addColorStop(0, scene.gradient[0]);
  grad.addColorStop(1, scene.gradient[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Vignette
  const vin = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.75);
  vin.addColorStop(0, "rgba(0,0,0,0)");
  vin.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vin;
  ctx.fillRect(0, 0, w, h);

  const scale = h / 1280;

  // Shot-type chip (stand-in for the generated footage)
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  const chipW = 260 * scale;
  ctx.beginPath();
  ctx.roundRect(w / 2 - chipW / 2, h * 0.09, chipW, 44 * scale, 22 * scale);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `600 ${20 * scale}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`◉ ${SHOT_LABELS[scene.shotType] || "SCENE"}`, w / 2, h * 0.09 + 30 * scale);

  // Scene counter
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = `500 ${18 * scale}px Inter, system-ui, sans-serif`;
  ctx.fillText(`scene ${index + 1}/${output.scenes.length}`, w / 2, h * 0.09 + 70 * scale);

  // On-screen text (big, center)
  if (scene.onScreenText) {
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${52 * scale}px Inter, system-ui, sans-serif`;
    ctx.shadowColor = "rgba(244,63,94,0.65)";
    ctx.shadowBlur = 26 * scale;
    const lines = wrapText(ctx, scene.onScreenText, w * 0.8);
    lines.forEach((l, i) => ctx.fillText(l, w / 2, h * 0.42 + i * 62 * scale));
    ctx.shadowBlur = 0;
  }

  // Caption bar (auto-timed style)
  if (scene.caption) {
    ctx.font = `600 ${28 * scale}px Inter, system-ui, sans-serif`;
    const lines = wrapText(ctx, scene.caption, w * 0.78);
    const lineH = 40 * scale;
    const boxH = lines.length * lineH + 30 * scale;
    const boxY = h * 0.72;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(w * 0.06, boxY, w * 0.88, boxH, 18 * scale);
    ctx.fill();
    ctx.fillStyle = "#f7edf1";
    lines.forEach((l, i) => ctx.fillText(l, w / 2, boxY + 42 * scale + i * lineH));
  }

  // Product tag
  if (output.productName) {
    ctx.fillStyle = "rgba(244,63,94,0.9)";
    ctx.font = `700 ${22 * scale}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(output.productName, w * 0.06, h * 0.955);
    ctx.textAlign = "center";
  }

  // Watermark (free tier)
  if (output.watermark) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${26 * scale}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("TrendForge", w * 0.94, h * 0.955);
    ctx.restore();
    ctx.textAlign = "center";
  }

  // Progress bar
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(0, h - 6 * scale, w, 6 * scale);
  ctx.fillStyle = "#f43f5e";
  ctx.fillRect(0, h - 6 * scale, w * Math.min(tSec / output.totalDurationSec, 1), 6 * scale);
}
