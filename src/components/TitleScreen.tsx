"use client";

import Image from "next/image";
import type { Life } from "@/lib/types";

export default function TitleScreen({
  lives,
  onSelect,
}: {
  lives: Life[];
  onSelect: (life: Life) => void;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <Image
        src="/backgrounds/title.png"
        alt=""
        fill
        priority
        className="pixelated object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/85" />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-[18vh]">
        <h1
          className="text-center text-4xl font-bold tracking-[0.15em] text-amber-50"
          style={{ textShadow: "3px 3px 0 #7c2d12, 6px 6px 0 rgba(0,0,0,0.4)" }}
        >
          LIFE
          <br />
          JOURNEY
        </h1>
        <p className="mt-3 text-xs tracking-widest text-amber-100/90 [text-shadow:1px_1px_0_rgba(0,0,0,0.8)]">
          ── 人生を追体験する ──
        </p>
      </div>

      <div className="relative z-10 px-5 pb-10">
        <p className="mb-3 text-center text-sm text-amber-100 animate-pulse">
          人生を選んでください
        </p>
        <div className="flex flex-col gap-3">
          {lives.map((life) => (
            <button
              key={life.id}
              onClick={() => onSelect(life)}
              className="group rounded-md border-2 border-amber-100/70 bg-slate-900/85 px-4 py-3 text-left shadow-[3px_3px_0_rgba(0,0,0,0.5)] transition-transform active:translate-y-0.5 active:shadow-none"
            >
              <span className="flex items-center gap-2 text-sm text-amber-50">
                <span className="text-amber-300 transition-transform group-hover:translate-x-0.5">
                  ▶
                </span>
                {life.title}
              </span>
              <span className="mt-1 block pl-6 text-[10px] text-slate-300">
                {life.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
