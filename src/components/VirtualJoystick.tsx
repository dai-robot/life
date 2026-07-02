"use client";

import { useRef } from "react";
import type { Dir } from "@/lib/field";

const MAX_RADIUS = 44;

/**
 * アナログスティック風の仮想ジョイスティック。
 * 360°方向に滑らかに移動できる。
 */
export default function VirtualJoystick({ onDir }: { onDir: (dir: Dir) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    onDir({ x: 0, y: 0 });
    if (knobRef.current) {
      knobRef.current.style.transform = "translate(-50%, -50%)";
    }
  };

  const handlePointer = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > MAX_RADIUS) {
      dx = (dx / dist) * MAX_RADIUS;
      dy = (dy / dist) * MAX_RADIUS;
    }
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
    onDir({ x: dx / MAX_RADIUS, y: dy / MAX_RADIUS });
  };

  return (
    <div
      ref={baseRef}
      className="relative h-28 w-28 rounded-full border-2 border-slate-600/80 bg-slate-900/60 shadow-inner"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        handlePointer(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          handlePointer(e.clientX, e.clientY);
        }
      }}
      onPointerUp={reset}
      onPointerCancel={reset}
    >
      <div
        ref={knobRef}
        className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-200/80 bg-gradient-to-b from-amber-400 to-orange-500 shadow-md"
      />
    </div>
  );
}
