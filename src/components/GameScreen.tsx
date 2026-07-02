"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Choice, Life, MapPosition, Stats } from "@/lib/types";
import { INITIAL_STATS, applyEffects } from "@/lib/game";
import {
  DEFAULT_MARKERS,
  DEFAULT_SPAWN,
  INTERACT_RANGE,
  mapDistance,
} from "@/lib/field";
import { useFieldMovement, useKeyboardInput } from "@/hooks/useFieldMovement";
import { useNpcWander } from "@/hooks/useNpcWander";
import StatsHud from "./StatsHud";
import FieldMap from "./FieldMap";
import VirtualJoystick from "./VirtualJoystick";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { Pose } from "./PixelCharacter";

type Phase =
  | { kind: "intro" }
  | { kind: "eventText" }
  | { kind: "roam" }
  | { kind: "result"; text: string };

export default function GameScreen({
  life,
  onEnd,
}: {
  life: Life;
  onEnd: (stats: Stats) => void;
}) {
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [eventIndex, setEventIndex] = useState(0);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const event = life.events[eventIndex];
  const isIntro = phase.kind === "intro";
  const background = isIntro ? life.intro.background : event.background;
  const character =
    (isIntro ? life.intro.character : event.character) ?? life.character;
  const displayAge = event.age;
  const displayYear = life.birthYear + displayAge;
  const roaming = phase.kind === "roam";

  const npcDefs = useMemo(
    () => (roaming ? (event.npcs ?? []) : []),
    [roaming, event.npcs],
  );
  const npcStates = useNpcWander(npcDefs, roaming);

  const {
    pos,
    facing,
    moving,
    walkFrame,
    setKeyDir,
    setStickDir,
    setTouchDir,
  } = useFieldMovement(roaming, DEFAULT_SPAWN, eventIndex);

  const markers = useMemo(
    () =>
      event.choices.map((choice, i) => ({
        choice,
        position: choice.position ?? DEFAULT_MARKERS[i % DEFAULT_MARKERS.length],
      })),
    [event.choices],
  );

  const nearestMarker = useMemo(() => {
    if (!roaming) return null;
    let best: { choice: Choice; position: MapPosition; d: number } | null = null;
    for (const m of markers) {
      const d = mapDistance(pos, m.position);
      if (d > INTERACT_RANGE) continue;
      if (!best || d < best.d) best = { ...m, d };
    }
    return best;
  }, [roaming, markers, pos]);

  const npcsRendered = useMemo(
    () =>
      npcDefs.map((npc, i) => {
        const st = npcStates[i];
        const movingNpc = st.dir.x !== 0 || st.dir.y !== 0;
        return {
          ...npc,
          pos: st.pos,
          facing: (st.dir.x < 0 ? "left" : "right") as "left" | "right",
          moving: movingNpc,
        };
      }),
    [npcDefs, npcStates],
  );

  const nearestNpc = useMemo(() => {
    if (!roaming || nearestMarker) return null;
    let best: (typeof npcsRendered)[0] | null = null;
    let bestD = Infinity;
    for (const npc of npcsRendered) {
      const d = mapDistance(pos, npc.pos);
      if (d > INTERACT_RANGE) continue;
      if (d < bestD) {
        bestD = d;
        best = npc;
      }
    }
    return best;
  }, [roaming, nearestMarker, npcsRendered, pos]);

  const text =
    phase.kind === "intro"
      ? life.intro.text
      : phase.kind === "result"
        ? phase.text
        : event.text;

  const { shown, done, skip } = useTypewriter(text);
  const showWindow = phase.kind !== "roam";

  const choose = useCallback((choice: Choice) => {
    setStats((s) => applyEffects(s, choice.effects));
    setPhase({ kind: "result", text: choice.result });
  }, []);

  const advance = useCallback(() => {
    if (!done) {
      skip();
      return;
    }
    if (phase.kind === "intro") {
      setPhase({ kind: "eventText" });
    } else if (phase.kind === "eventText") {
      setPhase({ kind: "roam" });
    } else if (phase.kind === "result") {
      if (eventIndex + 1 < life.events.length) {
        setEventIndex((i) => i + 1);
        setPhase({ kind: "eventText" });
      } else {
        onEnd(statsRef.current);
      }
    }
  }, [done, skip, phase, eventIndex, life.events.length, onEnd]);

  const interact = useCallback(() => {
    if (nearestMarker) choose(nearestMarker.choice);
  }, [nearestMarker, choose]);

  useKeyboardInput(setKeyDir, interact, nearestMarker !== null);

  const pose: Pose = moving ? (walkFrame === 0 ? "walk1" : "walk2") : "idle";

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-slate-950">
      {showWindow ? (
        <div
          className="relative flex flex-1 flex-col overflow-hidden"
          onClick={advance}
        >
          <FieldMap
            background={background}
            character={character}
            pose="idle"
            facing={facing}
            playerPos={DEFAULT_SPAWN}
            markers={[]}
            npcs={[]}
            nearestMarker={null}
            nearestNpc={null}
            onFieldTouchDir={() => {}}
            interactive={false}
          />
          <div className="absolute inset-0 bg-slate-950/30" />
        </div>
      ) : (
        <FieldMap
          background={background}
          character={character}
          pose={pose}
          facing={facing}
          playerPos={pos}
          markers={markers}
          npcs={npcsRendered}
          nearestMarker={nearestMarker}
          nearestNpc={nearestNpc}
          onFieldTouchDir={setTouchDir}
        />
      )}

      {/* HUD */}
      <div className="pointer-events-none absolute left-3 top-3 z-30 rounded-md border-2 border-amber-100/60 bg-slate-900/80 px-3 py-1.5 text-center shadow-lg backdrop-blur-sm">
        <div className="text-xs text-amber-50">{displayYear}年</div>
        <div className="text-[10px] text-amber-200">{displayAge}歳</div>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 z-30">
        <StatsHud stats={stats} />
      </div>

      {roaming && (
        <div className="pointer-events-none absolute left-1/2 top-14 z-30 -translate-x-1/2 rounded-sm bg-slate-950/75 px-2 py-1 text-[9px] text-slate-300">
          フィールドを歩いて「！」を探そう
        </div>
      )}

      {/* 下部 UI */}
      <div className="relative z-40 h-44 shrink-0 bg-slate-950 px-3 pb-3 pt-2">
        {showWindow ? (
          <div
            onClick={advance}
            className="flex h-full flex-col rounded-md border-2 border-amber-100/80 bg-slate-900/95 p-3 shadow-[inset_0_0_0_2px_rgba(15,23,42,1),inset_0_0_0_3px_rgba(254,243,199,0.25)]"
          >
            {phase.kind === "eventText" && event.title && (
              <div className="mb-1 self-start rounded-sm bg-amber-200/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-900">
                {event.title}
              </div>
            )}
            <p className="flex-1 overflow-y-auto whitespace-pre-line text-[13px] leading-relaxed text-amber-50">
              {shown}
              {!done && <span className="animate-pulse">▌</span>}
            </p>
            {done && (
              <div className="text-right text-xs text-amber-300 animate-bounce">▼</div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-between px-2">
            <VirtualJoystick onDir={setStickDir} />
            <div className="flex flex-col items-center gap-1">
              <button
                aria-label="決定"
                onClick={interact}
                className={`flex h-16 w-16 items-center justify-center rounded-full border-2 text-lg font-bold shadow-[0_4px_0_#0f172a] transition-colors active:translate-y-0.5 active:shadow-none ${
                  nearestMarker
                    ? "animate-pulse border-amber-300 bg-amber-500/90 text-slate-900"
                    : "border-slate-500 bg-slate-800 text-slate-400"
                }`}
              >
                A
              </button>
              <span className="text-[9px] text-slate-400">
                {nearestMarker ? "けってい" : nearestNpc ? "話しかけ" : "けってい"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
