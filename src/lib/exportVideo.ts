// Client-side video export: replays the render manifest onto a canvas and
// records it with MediaRecorder. Produces a real downloadable video file
// (WebM in the MVP; server-side ffmpeg/real model adapters produce MP4).
import type { RenderOutput } from "../types";
import { paintFrame, RATIOS } from "./renderPaint";

export async function exportRenderAsVideo(
  output: RenderOutput,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const { w, h } = RATIOS[output.ratio] || RATIOS["9:16"];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const stream = canvas.captureStream(30);
  const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) =>
    MediaRecorder.isTypeSupported(m)
  );
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  const done = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
  });

  recorder.start(250);
  const total = output.totalDurationSec;
  const start = performance.now();

  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      if (t >= total) return resolve();
      paintFrame(ctx, output, t, w, h);
      onProgress?.(Math.round((t / total) * 100));
      requestAnimationFrame(tick);
    };
    tick();
  });

  recorder.stop();
  onProgress?.(100);
  return done;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
