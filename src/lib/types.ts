/**
 * 人生データの型定義。
 * 人生そのものは JSON ファイル (src/data/lives/*.json) で管理し、
 * コードはこの型を通してデータを扱う。
 */

/** プレイヤーの4つのパラメータ */
export type StatKey = "happiness" | "wealth" | "fame" | "family";

export type Stats = Record<StatKey, number>;

/** 選択肢によるパラメータ変化 (省略したキーは変化なし) */
export type Effects = Partial<Record<StatKey, number>>;

/** マップ上の位置 (背景に対する%座標) */
export interface MapPosition {
  x: number;
  y: number;
}

export interface Choice {
  /** マーカーに表示する文言 */
  text: string;
  /** 選択後に表示される結果テキスト */
  result: string;
  effects: Effects;
  /** マップ上のマーカー位置 (省略時は自動配置) */
  position?: MapPosition;
}

/** マップ上で話しかけられるNPC */
export interface Npc {
  name: string;
  /** スプライトID (PixelCharacter参照) */
  sprite: string;
  position: MapPosition;
  /** 話しかけたときのセリフ */
  text: string;
  /** false にするとその場に立ち止まる (デフォルトは徘徊する) */
  wander?: boolean;
}

export interface LifeEvent {
  /** このイベント時の年齢 */
  age: number;
  /** 背景ID (public/backgrounds/bg-{id}.png) */
  background: string;
  /** 主人公スプリットID (省略時は life.character) */
  character?: string;
  /** イベント見出し (例: 進路) */
  title?: string;
  text: string;
  choices: Choice[];
  /** マップにいる住人たち */
  npcs?: Npc[];
}

export interface LifeIntro {
  background: string;
  character?: string;
  text: string;
}

export interface LifeEpilogue {
  title: string;
  lines: string[];
}

export interface Life {
  id: string;
  title: string;
  subtitle: string;
  birthYear: number;
  /** デフォルトの主人公スプライトID */
  character: string;
  intro: LifeIntro;
  events: LifeEvent[];
  epilogue: LifeEpilogue;
}
