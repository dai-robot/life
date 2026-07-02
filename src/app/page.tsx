"use client";

import { useState } from "react";
import type { Life, Stats } from "@/lib/types";
import { LIVES } from "@/lib/lives";
import { useBgm } from "@/lib/useBgm";
import TitleScreen from "@/components/TitleScreen";
import GameScreen from "@/components/GameScreen";
import EndingScreen from "@/components/EndingScreen";

type Scene =
  | { phase: "title" }
  | { phase: "playing"; life: Life }
  | { phase: "ending"; life: Life; stats: Stats };

export default function Home() {
  const [scene, setScene] = useState<Scene>({ phase: "title" });
  const { playing, toggle } = useBgm();

  return (
    <main className="mx-auto h-dvh w-full max-w-md overflow-hidden bg-slate-950 font-pixel text-amber-50 select-none">
      <div className="relative h-full">
        {scene.phase === "title" && (
          <TitleScreen
            lives={LIVES}
            onSelect={(life) => setScene({ phase: "playing", life })}
          />
        )}
        {scene.phase === "playing" && (
          <GameScreen
            key={scene.life.id}
            life={scene.life}
            onEnd={(stats) =>
              setScene({ phase: "ending", life: scene.life, stats })
            }
          />
        )}
        {scene.phase === "ending" && (
          <EndingScreen
            life={scene.life}
            stats={scene.stats}
            onRestart={() => setScene({ phase: "title" })}
          />
        )}

        {/* BGM切り替え */}
        <button
          onClick={toggle}
          aria-label="BGM切り替え"
          className="absolute bottom-2 right-2 z-20 rounded-md border border-amber-100/40 bg-slate-900/70 px-2 py-1 text-[10px] text-amber-100"
        >
          ♪ {playing ? "ON" : "OFF"}
        </button>
      </div>
    </main>
  );
}
