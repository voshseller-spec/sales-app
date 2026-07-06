import type { Scene, ShotType } from "../types";
import { Badge, Button } from "./ui";

const SHOT_TYPES: { value: ShotType; label: string }[] = [
  { value: "product-in-hand", label: "Product-in-Hand" },
  { value: "b-roll", label: "B-roll" },
  { value: "talking-actor", label: "Talking Actor" },
  { value: "text-card", label: "Screen/Text card" },
];

export default function StoryboardEditor({
  scenes,
  onChange,
  onRegenerateScene,
  regeneratingId,
}: {
  scenes: Scene[];
  onChange: (scenes: Scene[]) => void;
  onRegenerateScene: (scene: Scene) => void;
  regeneratingId: string | null;
}) {
  const update = (id: string, patch: Partial<Scene>) =>
    onChange(scenes.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const move = (index: number, dir: -1 | 1) => {
    const next = [...scenes];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((s, i) => ({ ...s, order: i })));
  };

  const remove = (id: string) => onChange(scenes.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));

  return (
    <div className="space-y-3">
      {scenes.map((scene, i) => (
        <div key={scene.id} className="card p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white">Scene {i + 1}</span>
            <Badge tone="ember">{scene.beat}</Badge>
            <select
              className="input !w-auto !py-1 text-xs"
              value={scene.shotType}
              onChange={(e) => update(scene.id, { shotType: e.target.value as ShotType })}
            >
              {SHOT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-1 text-xs text-mist-300">
              <input
                type="number"
                min={1}
                max={20}
                className="input !w-16 !py-1 text-xs"
                value={scene.durationSec}
                onChange={(e) => update(scene.id, { durationSec: Math.max(1, Number(e.target.value) || 1) })}
              />
              sec
            </label>
            <div className="ml-auto flex gap-1">
              <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">↑</Button>
              <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => move(i, 1)} disabled={i === scenes.length - 1} title="Move down">↓</Button>
              <Button
                variant="ghost"
                className="!px-2 !py-1 text-xs"
                onClick={() => onRegenerateScene(scene)}
                disabled={regeneratingId === scene.id}
                title="Regenerate just this scene"
              >
                {regeneratingId === scene.id ? "…" : "↻ regen"}
              </Button>
              <Button variant="danger" className="!px-2 !py-1 text-xs" onClick={() => remove(scene.id)} disabled={scenes.length <= 2} title="Delete scene">✕</Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-xs text-mist-500">
              Voiceover
              <textarea
                className="input mt-1 min-h-16 text-[13px]"
                value={scene.voiceoverText}
                onChange={(e) => update(scene.id, { voiceoverText: e.target.value })}
              />
            </label>
            <label className="block text-xs text-mist-500">
              Visual prompt (editable)
              <textarea
                className="input mt-1 min-h-16 text-[13px]"
                value={scene.visualPrompt}
                onChange={(e) => update(scene.id, { visualPrompt: e.target.value })}
              />
            </label>
            <label className="block text-xs text-mist-500">
              On-screen text
              <input
                className="input mt-1 text-[13px]"
                value={scene.onScreenText}
                onChange={(e) => update(scene.id, { onScreenText: e.target.value })}
              />
            </label>
            <label className="block text-xs text-mist-500">
              Camera note
              <input
                className="input mt-1 text-[13px]"
                value={scene.cameraNote}
                onChange={(e) => update(scene.id, { cameraNote: e.target.value })}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
