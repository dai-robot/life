"use client";

import { useEffect, useRef, useState } from "react";
import type { MapPosition } from "@/lib/types";
import {
  DEFAULT_BOUNDS,
  MOVE_SPEED,
  clampPosition,
  combineDirs,
  type Dir,
} from "@/lib/field";

export function useFieldMovement(active: boolean, spawn: MapPosition, resetKey = 0) {
  const [pos, setPos] = useState<MapPosition>(spawn);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [moving, setMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);

  const keyDirRef = useRef<Dir>({ x: 0, y: 0 });
  const stickDirRef = useRef<Dir>({ x: 0, y: 0 });
  const touchDirRef = useRef<Dir>({ x: 0, y: 0 });

  // イベント切り替え時にスポーン位置へ
  useEffect(() => {
    setPos(spawn);
    setMoving(false);
  }, [resetKey, spawn.x, spawn.y]);

  useEffect(() => {
    if (!active) {
      setMoving(false);
      return;
    }

    let raf = 0;
    let last = performance.now();
    let frameAcc = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const dir = combineDirs(
        keyDirRef.current,
        stickDirRef.current,
        touchDirRef.current,
      );

      if (dir.x !== 0 || dir.y !== 0) {
        setPos((p) =>
          clampPosition({
            x: p.x + dir.x * MOVE_SPEED.x * dt,
            y: p.y + dir.y * MOVE_SPEED.y * dt,
          }),
        );
        if (dir.x !== 0) setFacing(dir.x < 0 ? "left" : "right");
        setMoving(true);
        frameAcc += dt;
        if (frameAcc > 0.16) {
          frameAcc = 0;
          setWalkFrame((f) => (f + 1) % 2);
        }
      } else {
        setMoving(false);
        frameAcc = 0;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return {
    pos,
    facing,
    moving,
    walkFrame,
    setKeyDir: (d: Dir) => {
      keyDirRef.current = d;
    },
    setStickDir: (d: Dir) => {
      stickDirRef.current = d;
    },
    setTouchDir: (d: Dir) => {
      touchDirRef.current = d;
    },
  };
}

/** 矢印/WASD キーボード入力 */
export function useKeyboardInput(
  onMove: (dir: Dir) => void,
  onAction: () => void,
  actionEnabled: boolean,
) {
  const onMoveRef = useRef(onMove);
  const onActionRef = useRef(onAction);
  const actionEnabledRef = useRef(actionEnabled);
  onMoveRef.current = onMove;
  onActionRef.current = onAction;
  actionEnabledRef.current = actionEnabled;

  useEffect(() => {
    const pressed = new Set<string>();
    const update = () => {
      onMoveRef.current({
        x:
          (pressed.has("ArrowRight") || pressed.has("KeyD") ? 1 : 0) -
          (pressed.has("ArrowLeft") || pressed.has("KeyA") ? 1 : 0),
        y:
          (pressed.has("ArrowDown") || pressed.has("KeyS") ? 1 : 0) -
          (pressed.has("ArrowUp") || pressed.has("KeyW") ? 1 : 0),
      });
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (["Space", "Enter", "KeyZ"].includes(e.code)) {
        e.preventDefault();
        if (e.repeat) return;
        onActionRef.current();
        return;
      }
      pressed.add(e.code);
      update();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      pressed.delete(e.code);
      update();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      onMoveRef.current({ x: 0, y: 0 });
    };
  }, []);
}
