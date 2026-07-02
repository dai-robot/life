"use client";

import Image from "next/image";
import type { Life, Stats } from "@/lib/types";
import { STAT_KEYS, STAT_LABELS, toStars } from "@/lib/game";

function Stars({ count }: { count: number }) {
  return (
    <span className="tracking-widest">
      <span className="text-amber-300">{"★".repeat(count)}</span>
      <span className="text-slate-600">{"★".repeat(5 - count)}</span>
    </span>
  );
}

export default function EndingScreen({
  life,
  stats,
  onRestart,
}: {
  life: Life;
  stats: Stats;
  onRestart: () => void;
}) {
  const lastAge = life.events[life.events.length - 1].age;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <Image
        src="/backgrounds/title.png"
        alt=""
        fill
        priority
        className="pixelated object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-slate-950/60" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-6 py-10">
        <div className="text-center">
          <p className="text-[11px] text-slate-300">{life.title}</p>
          <h2 className="mt-1 text-2xl font-bold text-amber-50 [text-shadow:2px_2px_0_rgba(0,0,0,0.6)]">
            あなたの人生
          </h2>
          <p className="mt-1 text-[11px] text-slate-300">
            {life.birthYear}年 〜 {life.birthYear + lastAge}年
          </p>
        </div>

        <div className="w-full max-w-xs rounded-md border-2 border-amber-100/70 bg-slate-900/90 p-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
          {STAT_KEYS.map((key, i) => (
            <div
              key={key}
              className="animate-stat-in flex items-center justify-between py-1.5 text-sm opacity-0"
              style={{ animationDelay: `${i * 0.45}s` }}
            >
              <span className="text-amber-50">{STAT_LABELS[key]}</span>
              <Stars count={toStars(stats[key])} />
            </div>
          ))}
        </div>

        <div
          className="animate-stat-in w-full max-w-xs rounded-md border-2 border-amber-100/40 bg-slate-900/80 p-4 opacity-0"
          style={{ animationDelay: "2.2s" }}
        >
          <h3 className="mb-2 text-center text-xs font-bold text-amber-200">
            ── {life.epilogue.title} ──
          </h3>
          {life.epilogue.lines.map((line) => (
            <p key={line} className="py-1 text-[11px] leading-relaxed text-slate-200">
              {line}
            </p>
          ))}
        </div>

        <button
          onClick={onRestart}
          className="animate-stat-in mt-2 rounded-md border-2 border-amber-100/70 bg-slate-900/90 px-6 py-2.5 text-sm text-amber-50 opacity-0 shadow-[3px_3px_0_rgba(0,0,0,0.5)] transition-transform active:translate-y-0.5 active:shadow-none"
          style={{ animationDelay: "2.8s" }}
        >
          ▶ タイトルへもどる
        </button>
      </div>
    </div>
  );
}
