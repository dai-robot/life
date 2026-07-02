"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Choice, MapPosition, Npc } from "@/lib/types";
import {
  MAP_SCALE,
  calcCameraOffset,
  depthScale,
} from "@/lib/field";
import PixelCharacter, { type Pose } from "./PixelCharacter";

type Marker = { choice: Choice; position: MapPosition };

type NpcRender = Npc & { pos: MapPosition; facing: "left" | "right"; moving: boolean };

export default function FieldMap({
  background,
  character,
  pose,
  facing,
  playerPos,
  markers,
  npcs,
  nearestMarker,
  nearestNpc,
  onFieldTouchDir,
  interactive = true,
}: {
  background: string;
  character: string;
  pose: Pose;
  facing: "left" | "right";
  playerPos: MapPosition;
  markers: Marker[];
  npcs: NpcRender[];
  nearestMarker: Marker | null;
  nearestNpc: NpcRender | null;
  onFieldTouchDir: (dir: { x: number; y: number }) => void;
  interactive?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      setCamera(
        calcCameraOffset(playerPos, {
          w: el.clientWidth,
          h: el.clientHeight,
        }),
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [playerPos]);

  const handleTouchMove = (clientX: number, clientY: number) => {
    const el = viewportRef.current;
    if (!el || !touchOrigin.current) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.55;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const len = Math.hypot(dx, dy);
    if (len < 12) {
      onFieldTouchDir({ x: 0, y: 0 });
      return;
    }
    onFieldTouchDir({ x: dx / len, y: dy / len });
  };

  return (
    <div
      ref={viewportRef}
      className={`relative flex-1 overflow-hidden ${interactive ? "" : "pointer-events-none"}`}
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        touchOrigin.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
        handleTouchMove(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          handleTouchMove(e.clientX, e.clientY);
        }
      }}
      onPointerUp={() => {
        touchOrigin.current = null;
        onFieldTouchDir({ x: 0, y: 0 });
      }}
      onPointerCancel={() => {
        touchOrigin.current = null;
        onFieldTouchDir({ x: 0, y: 0 });
      }}
    >
      {/* スクロールする広いマップ */}
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: `${MAP_SCALE.w}%`,
          height: `${MAP_SCALE.h}%`,
          transform: `translate(${camera.x}px, ${camera.y}px)`,
        }}
      >
        <div className="relative h-full w-full">
        <Image
          src={`/backgrounds/bg-${background}.png`}
          alt=""
          fill
          priority
          className="pixelated object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/50 to-transparent" />

        {/* NPC */}
        {npcs.map((npc) => {
          const near = nearestNpc?.name === npc.name;
          const scale = depthScale(npc.pos.y);
          const npcMoving = npc.moving;
          const npcPose: Pose = npcMoving ? "walk1" : "idle";
          return (
            <div
              key={npc.name}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{
                left: `${npc.pos.x}%`,
                top: `${npc.pos.y}%`,
                zIndex: Math.round(npc.pos.y),
                transform: `translate(-50%, -100%) scale(${scale})`,
                transformOrigin: "bottom center",
              }}
            >
              {near && (
                <div className="animate-stat-in mb-1 w-max max-w-[8.5rem] rounded-md border-2 border-sky-200/80 bg-slate-900/95 px-2 py-1 text-center text-[10px] leading-snug text-sky-50 shadow-md">
                  <span className="block text-[9px] text-sky-300">{npc.name}</span>
                  {npc.text}
                </div>
              )}
              <div className="drop-shadow-[0_3px_1px_rgba(0,0,0,0.4)]">
                <PixelCharacter
                  sprite={npc.sprite}
                  height={76}
                  pose={npcPose}
                  facing={npc.facing}
                />
              </div>
            </div>
          );
        })}

        {/* 選択肢マーカー */}
        {markers.map(({ choice, position }) => {
          const active = nearestMarker?.choice === choice;
          return (
            <div
              key={choice.text}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                zIndex: Math.round(position.y) + 1,
              }}
            >
              <div className="flex flex-col items-center">
                {active && (
                  <div className="animate-stat-in mb-1 w-max max-w-[9rem] rounded-md border-2 border-amber-300 bg-slate-900/95 px-2 py-1.5 text-center text-[11px] leading-snug text-amber-50 shadow-[3px_3px_0_rgba(0,0,0,0.6)]">
                    {choice.text}
                    <span className="mt-0.5 block text-[9px] text-amber-300">
                      Ⓐ けってい
                    </span>
                  </div>
                )}
                <div
                  className={`animate-marker-bob flex h-7 w-7 items-center justify-center rounded-sm border-2 shadow-md ${
                    active
                      ? "border-amber-200 bg-amber-400"
                      : "border-amber-100/70 bg-orange-500/90"
                  }`}
                >
                  <span className="-rotate-45 text-sm font-bold text-slate-900">!</span>
                </div>
                {!active && (
                  <span className="mt-1 w-max max-w-[7rem] rounded-sm bg-slate-950/75 px-1 py-0.5 text-center text-[9px] leading-tight text-amber-100/90">
                    {choice.text}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* 主人公 */}
        <div
          className="absolute"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            zIndex: Math.round(playerPos.y) + 2,
            transform: `translate(-50%, -100%) scale(${depthScale(playerPos.y)})`,
            transformOrigin: "bottom center",
          }}
        >
          <div className="drop-shadow-[0_4px_2px_rgba(0,0,0,0.45)]">
            <PixelCharacter sprite={character} height={88} pose={pose} facing={facing} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
