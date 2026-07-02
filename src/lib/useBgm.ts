"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Web Audio で鳴らす、落ち着いたチップチューン風BGM。
 * 音源ファイルを使わずコードだけでループ再生する。
 */

const TEMPO = 72; // BPM
const BEAT = 60 / TEMPO;

// C メジャーペンタトニックの穏やかなメロディ (周波数, 拍数)
const MELODY: [number, number][] = [
  [523.25, 1], [587.33, 1], [659.25, 2],
  [783.99, 1], [659.25, 1], [587.33, 2],
  [523.25, 1], [440.0, 1], [523.25, 2],
  [587.33, 1], [523.25, 1], [440.0, 2],
  [392.0, 1], [440.0, 1], [523.25, 2],
  [659.25, 1], [587.33, 1], [523.25, 2],
  [440.0, 1], [392.0, 1], [440.0, 4],
];

// ゆったりしたベース (周波数, 拍数)
const BASS: [number, number][] = [
  [130.81, 4], [98.0, 4], [110.0, 4], [98.0, 4],
  [130.81, 4], [98.0, 4], [110.0, 4], [98.0, 4],
];

class BgmPlayer {
  private ctx: AudioContext;
  private master: GainNode;
  private timer: number | null = null;

  constructor() {
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.12;

    // 柔らかい残響がわりのディレイ
    const delay = this.ctx.createDelay();
    delay.delayTime.value = BEAT * 0.75;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.25;
    this.master.connect(this.ctx.destination);
    this.master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.ctx.destination);
  }

  private note(freq: number, start: number, duration: number, type: OscillatorType, volume: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.03);
    gain.gain.setTargetAtTime(0, start + duration * 0.7, duration * 0.15);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.3);
  }

  private scheduleLoop = (loopStart: number) => {
    let t = loopStart;
    for (const [freq, beats] of MELODY) {
      this.note(freq, t, beats * BEAT, "triangle", 0.5);
      t += beats * BEAT;
    }
    let bt = loopStart;
    for (const [freq, beats] of BASS) {
      this.note(freq, bt, beats * BEAT, "sine", 0.35);
      bt += beats * BEAT;
    }
    const loopEnd = Math.max(t, bt);
    const waitMs = (loopEnd - this.ctx.currentTime - 0.5) * 1000;
    this.timer = window.setTimeout(() => this.scheduleLoop(loopEnd), Math.max(waitMs, 100));
  };

  start() {
    void this.ctx.resume();
    this.scheduleLoop(this.ctx.currentTime + 0.1);
  }

  stop() {
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    void this.ctx.close();
  }
}

export function useBgm() {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<BgmPlayer | null>(null);

  const toggle = useCallback(() => {
    setPlaying((prev) => {
      if (prev) {
        playerRef.current?.stop();
        playerRef.current = null;
        return false;
      }
      const player = new BgmPlayer();
      player.start();
      playerRef.current = player;
      return true;
    });
  }, []);

  useEffect(() => {
    return () => playerRef.current?.stop();
  }, []);

  return { playing, toggle };
}
