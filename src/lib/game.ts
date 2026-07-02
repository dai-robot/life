import type { Effects, StatKey, Stats } from "./types";

export const STAT_KEYS: StatKey[] = ["happiness", "wealth", "fame", "family"];

export const STAT_LABELS: Record<StatKey, string> = {
  happiness: "幸福",
  wealth: "財産",
  fame: "名声",
  family: "家族",
};

export const STAT_MIN = 0;
export const STAT_MAX = 10;

/** 全員この値からスタート */
export const INITIAL_STATS: Stats = {
  happiness: 3,
  wealth: 3,
  fame: 3,
  family: 3,
};

export function applyEffects(stats: Stats, effects: Effects): Stats {
  const next = { ...stats };
  for (const key of STAT_KEYS) {
    const delta = effects[key] ?? 0;
    next[key] = Math.min(STAT_MAX, Math.max(STAT_MIN, next[key] + delta));
  }
  return next;
}

/** エンディングの星の数 (1〜5) に変換する */
export function toStars(value: number): number {
  return Math.min(5, Math.max(1, Math.round((value / STAT_MAX) * 5)));
}
