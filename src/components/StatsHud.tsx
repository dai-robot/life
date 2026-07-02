import type { Stats } from "@/lib/types";
import { STAT_KEYS, STAT_LABELS, STAT_MAX } from "@/lib/game";

/** 画面右上に出す小さなパラメータ表示 */
export default function StatsHud({ stats }: { stats: Stats }) {
  return (
    <div className="rounded-md border-2 border-amber-100/60 bg-slate-900/80 px-2 py-1.5 text-[10px] leading-tight shadow-lg backdrop-blur-sm">
      {STAT_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-1.5 py-0.5">
          <span className="w-7 text-amber-100">{STAT_LABELS[key]}</span>
          <div className="flex h-1.5 w-14 overflow-hidden rounded-sm bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-500"
              style={{ width: `${(stats[key] / STAT_MAX) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
