import type { Life } from "./types";
import salaryman1950 from "@/data/lives/salaryman-1950.json";
import samurai1700 from "@/data/lives/samurai-1700.json";

/**
 * 遊べる人生の一覧。
 * 新しい人生を追加するときは src/data/lives/ に JSON を置いて
 * ここに1行追加するだけでよい。
 */
export const LIVES: Life[] = [salaryman1950 as Life, samurai1700 as Life];

export function getLife(id: string): Life | undefined {
  return LIVES.find((life) => life.id === id);
}
