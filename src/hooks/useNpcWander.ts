"use client";

import { useEffect, useState } from "react";
import type { MapPosition, Npc } from "@/lib/types";
import { DEFAULT_BOUNDS, NPC_SPEED, clampPosition } from "@/lib/field";

type NpcState = {
  pos: MapPosition;
  dir: { x: number; y: number };
  wait: number;
};

function randomDir() {
  const angle = Math.random() * Math.PI * 2;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

/** マップ上を歩き回るNPC */
export function useNpcWander(npcs: Npc[], active: boolean) {
  const [states, setStates] = useState<NpcState[]>(() =>
    npcs.map((n) => ({
      pos: { ...n.position },
      dir: randomDir(),
      wait: Math.random() * 2,
    })),
  );

  // NPCリストが変わったらリセット
  useEffect(() => {
    setStates(
      npcs.map((n) => ({
        pos: { ...n.position },
        dir: randomDir(),
        wait: Math.random() * 2,
      })),
    );
  }, [npcs]);

  useEffect(() => {
    if (!active || npcs.length === 0) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      setStates((prev) =>
        prev.map((s, i) => {
          const npc = npcs[i];
          if (npc.wander === false) return s;

          let { pos, dir, wait } = s;
          wait -= dt;

          if (wait <= 0) {
            if (Math.random() < 0.35) {
              wait = 0.8 + Math.random() * 2.5;
              dir = { x: 0, y: 0 };
            } else {
              wait = 1.5 + Math.random() * 3;
              dir = randomDir();
            }
          }

          if (dir.x !== 0 || dir.y !== 0) {
            pos = clampPosition({
              x: pos.x + dir.x * NPC_SPEED * dt,
              y: pos.y + dir.y * NPC_SPEED * dt * 0.75,
            });
            // 端に当たったら方向転換
            if (
              pos.x <= DEFAULT_BOUNDS.minX + 1 ||
              pos.x >= DEFAULT_BOUNDS.maxX - 1
            ) {
              dir = { x: -dir.x, y: dir.y };
            }
            if (
              pos.y <= DEFAULT_BOUNDS.minY + 1 ||
              pos.y >= DEFAULT_BOUNDS.maxY - 1
            ) {
              dir = { x: dir.x, y: -dir.y };
            }
          }

          return { pos, dir, wait };
        }),
      );

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, npcs]);

  return states;
}
