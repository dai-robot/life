import type { MapPosition } from "./types";

/** フィールド全体の倍率 (画面より広いマップ) */
export const MAP_SCALE = { w: 240, h: 200 }; // % of viewport

export const DEFAULT_SPAWN: MapPosition = { x: 50, y: 82 };
export const DEFAULT_BOUNDS = { minX: 4, maxX: 96, minY: 38, maxY: 90 };

export const MOVE_SPEED = { x: 42, y: 30 };
export const INTERACT_RANGE = 14;
export const NPC_SPEED = 14;

/** 選択肢マーカーのデフォルト配置 */
export const DEFAULT_MARKERS: MapPosition[] = [
  { x: 22, y: 62 },
  { x: 50, y: 52 },
  { x: 78, y: 62 },
];

export function clampPosition(
  pos: MapPosition,
  bounds = DEFAULT_BOUNDS,
): MapPosition {
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, pos.x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, pos.y)),
  };
}

/** 奥行きっぽいスケール (手前ほど大きく) */
export function depthScale(y: number): number {
  return 0.68 + (y / 100) * 0.58;
}

/** 2点間距離 (縦方向は奥行きとして重み付け) */
export function mapDistance(a: MapPosition, b: MapPosition): number {
  const dx = a.x - b.x;
  const dy = (a.y - b.y) * 1.55;
  return Math.hypot(dx, dy);
}

/** プレイヤーを画面中央寄りに保つカメラオフセット */
export function calcCameraOffset(
  player: MapPosition,
  viewport: { w: number; h: number },
): { x: number; y: number } {
  const mw = viewport.w * (MAP_SCALE.w / 100);
  const mh = viewport.h * (MAP_SCALE.h / 100);
  const px = (player.x / 100) * mw;
  const py = (player.y / 100) * mh;
  const focusX = viewport.w * 0.5;
  const focusY = viewport.h * 0.63;

  let tx = focusX - px;
  let ty = focusY - py;
  tx = Math.min(0, Math.max(viewport.w - mw, tx));
  ty = Math.min(0, Math.max(viewport.h - mh, ty));
  return { x: tx, y: ty };
}

export type Dir = { x: number; y: number };

export function normalizeDir(dir: Dir): Dir {
  const len = Math.hypot(dir.x, dir.y);
  if (len < 0.01) return { x: 0, y: 0 };
  return { x: dir.x / len, y: dir.y / len };
}

export function combineDirs(...dirs: Dir[]): Dir {
  const sum = dirs.reduce(
    (acc, d) => ({ x: acc.x + d.x, y: acc.y + d.y }),
    { x: 0, y: 0 },
  );
  return normalizeDir(sum);
}
