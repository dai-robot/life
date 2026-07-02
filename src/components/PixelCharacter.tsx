/**
 * ドット絵の主人公キャラクター。
 * 文字列のマップ (1文字=1ドット) を SVG に変換して描画する。
 */

export type Pose = "idle" | "walk1" | "walk2";

type LegStyle = "pants" | "hakama";

type Sprite = {
  body: string[];
  legStyle: LegStyle;
  palette: Record<string, string>;
};

const BASE_PALETTE: Record<string, string> = {
  S: "#f2c79b",
  E: "#2b2320",
  M: "#c98a6b",
};

const LEGS: Record<LegStyle, Record<Pose, string[]>> = {
  pants: {
    idle: ["...LL..LL...", "...LL..LL...", "...LL..LL...", "..FFF..FFF.."],
    walk1: ["...LL..LL...", "...LL..LL...", "..FFF..LL...", ".......FFF.."],
    walk2: ["...LL..LL...", "...LL..LL...", "...LL..FFF..", "..FFF......."],
  },
  hakama: {
    idle: [
      "...GGGGGG...",
      "...GG..GG...",
      "...GG..GG...",
      "...GG..GG...",
      "..FFF..FFF..",
    ],
    walk1: [
      "...GGGGGG...",
      "...GG..GG...",
      "...GG..GG...",
      "..FFF..GG...",
      ".......FFF..",
    ],
    walk2: [
      "...GGGGGG...",
      "...GG..GG...",
      "...GG..GG...",
      "...GG..FFF..",
      "..FFF.......",
    ],
  },
};

const SPRITES: Record<string, Sprite> = {
  student: {
    legStyle: "pants",
    body: [
      "....HHHH....", "...HHHHHH...", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...BBBBBB...",
      "..BBBCCBBB..", ".SBBBCCBBBS.", ".SBBBBBBBBS.", "...BBBBBB...",
    ],
    palette: { ...BASE_PALETTE, H: "#2b2b35", B: "#26324e", C: "#c9a13c", L: "#26324e", F: "#3d2f24" },
  },
  salaryman: {
    legStyle: "pants",
    body: [
      "....HHHH....", "...HHHHHH...", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...BBWWBB...",
      "..BBWTTWBB..", ".SBBWTTWBBS.", ".SBBBWWBBBS.", "...BBBBBB...",
    ],
    palette: { ...BASE_PALETTE, H: "#3a332c", B: "#5a6270", W: "#e8e4da", T: "#8c3838", L: "#41474f", F: "#241d18" },
  },
  friend: {
    legStyle: "pants",
    body: [
      "....HHHH....", "...HHHHHH...", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...GGGGGG...",
      "..GGGRRGGG..", ".SGGGRRGGGS.", ".SGGGGGGGGS.", "...GGGGGG...",
    ],
    palette: { ...BASE_PALETTE, H: "#2b2b35", G: "#3d7a4a", R: "#c94040", L: "#26324e", F: "#3d2f24" },
  },
  colleague: {
    legStyle: "pants",
    body: [
      "....HHHH....", "...HHHHHH...", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...BBWWBB...",
      "..BBWWWWBB..", ".SBBWWWWBBS.", ".SBBBBBBBBS.", "...BBBBBB...",
    ],
    palette: { ...BASE_PALETTE, H: "#3a332c", B: "#4a5568", W: "#e8e4da", L: "#41474f", F: "#241d18" },
  },
  elder: {
    legStyle: "pants",
    body: [
      "....WWWW....", "...WWWWWW...", "..WWWWWWWW..", "..WSSSSSSW..",
      "..WSESSESW..", "...SSMMSS...", "....SSSS....", "...BBBBBB...",
      "..BBBBBBBB..", ".SBBBBBBBBS.", ".SBBBBBBBBS.", "...BBBBBB...",
    ],
    palette: { ...BASE_PALETTE, W: "#9ca3af", B: "#6b7280", L: "#4b5563", F: "#374151" },
  },
  lady: {
    legStyle: "hakama",
    body: [
      "....HHHH....", "...HHHHHH...", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...PPPPPP...",
      "..PPPBBPPP..", ".SPPBBBPPS.", ".SPPPPPPPS.",
    ],
    palette: { ...BASE_PALETTE, H: "#2b2b35", P: "#c45c7a", B: "#f5e6d0", G: "#8b4558", F: "#e0d6c2" },
  },
  farmer: {
    legStyle: "pants",
    body: [
      "...RRRRRR...", "..RRRRRRRR..", "..HSSSSSSH..", "..HSESSESH..",
      "...SSMMSS...", "....SSSS....", "...TTTTTT...", "..TTTTTTTT..",
      ".STTTTTTTTS.", ".STTTTTTTTS.", "...TTTTTT...",
    ],
    palette: { ...BASE_PALETTE, R: "#c4a035", H: "#2b2b35", T: "#6b5344", L: "#5c4033", F: "#3d2f24" },
  },
  merchant: {
    legStyle: "pants",
    body: [
      "....HHHH....", "...HHHHHH...", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...AAAAAA...",
      "..AAAOOAAA..", ".SAAAOOAAAS.", ".SAAAAAAAAS.", "...AAAAAA...",
    ],
    palette: { ...BASE_PALETTE, H: "#2b2b35", A: "#d4a574", O: "#ffffff", L: "#6b5344", F: "#3d2f24" },
  },
  wakamusha: {
    legStyle: "hakama",
    body: [
      ".....KK.....", "....KKKK....", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...BBVVBB...",
      "..BBBVVBBB..", ".SBBBVVBBBS.", ".SBBBBBBBBS.",
    ],
    palette: { ...BASE_PALETTE, K: "#2b2b35", H: "#2b2b35", B: "#4a7a92", V: "#dfe6e2", G: "#4d5359", F: "#e0d6c2" },
  },
  samurai: {
    legStyle: "hakama",
    body: [
      ".....KK.....", "....KKKK....", "..HHHHHHHH..", "..HSSSSSSH..",
      "..HSESSESH..", "...SSMMSS...", "....SSSS....", "...BBVVBB...",
      "..BBBVVBBB..", ".SBBBVVBBBS.", ".SBBBBBBBBS.",
    ],
    palette: { ...BASE_PALETTE, K: "#2b2b35", H: "#2b2b35", B: "#3f6d5a", V: "#e8e4da", G: "#52585e", F: "#e0d6c2" },
  },
};

export default function PixelCharacter({
  sprite,
  height = 96,
  pose = "idle",
  facing = "right",
}: {
  sprite: string;
  height?: number;
  pose?: Pose;
  facing?: "left" | "right";
}) {
  const data = SPRITES[sprite] ?? SPRITES.salaryman;
  const legPose = pose === "walk2" ? "walk2" : pose === "walk1" ? "walk1" : "idle";
  const map = [...data.body, ...LEGS[data.legStyle][legPose]];
  const rows = map.length;
  const cols = map[0].length;

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      height={height}
      width={(height / rows) * cols}
      shapeRendering="crispEdges"
      style={{ transform: facing === "left" ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      {map.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const color = ch === "." ? undefined : data.palette[ch];
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
        }),
      )}
    </svg>
  );
}
