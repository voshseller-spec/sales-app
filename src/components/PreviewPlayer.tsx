import { useEffect, useRef, useState } from "react";
import type { RenderOutput } from "../types";
import { paintFrame, RATIOS } from "../lib/renderPaint";

export default function PreviewPlayer({ output }: { output: RenderOutput }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = RATIOS[output.ratio] || RATIOS["9:16"];
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      if (playing) {
        tRef.current = (tRef.current + (now - last) / 1000) % output.totalDurationSec;
      }
      last = now;
      paintFrame(ctx, output, tRef.current, w, h);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [output, playing]);

  const isVertical = (output.ratio || "9:16") === "9:16";

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        onClick={() => setPlaying((p) => !p)}
        className={`cursor-pointer rounded-2xl border border-white/10 shadow-2xl shadow-ember-500/10 ${
          isVertical ? "max-h-[520px] w-auto" : "w-full max-w-lg"
        }`}
        title={playing ? "Click to pause" : "Click to play"}
      />
      <span className="text-[11px] text-mist-500">
        {playing ? "▶ playing" : "⏸ paused"} · {output.ratio} · {Math.round(output.totalDurationSec)}s
        {output.watermark ? " · watermarked (free tier)" : ""}
      </span>
    </div>
  );
}
