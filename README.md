# LIFE JOURNEY（仮）

歴史上のさまざまな時代の人物になり、その人生を5〜10分で追体験するシミュレーションゲームの試作品です。

## 遊べる人生

- 1950年生まれの日本人サラリーマン
- 1700年生まれの日本の武士

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで <http://localhost:3000> を開きます。スマホ縦画面を想定しているため、PCではブラウザの開発者ツールでモバイル表示にすると雰囲気が出ます。

## Web公開 (GitHub Pages)

`main` ブランチへの push で GitHub Actions が自動デプロイします。

- 公開URL: <https://dai-robot.github.io/life/>
- 初回はリポジトリの **Settings → Pages → Build and deployment → Source: GitHub Actions** を有効にしてください

## 操作方法

RPGのようにキャラクターを自由に歩かせて人生を選びます。

- **移動** … 左下のジョイスティック / フィールドをドラッグ (スマホ) / 矢印キー・WASD (PC)
- **決定** … Aボタン (PCは Space / Enter / Z)
- 各年齢のマップに選択肢が「！」マーカーとして置かれています。近づくと吹き出しが出るので、Aボタンで決定
- マップ上のNPCに近づくとセリフが表示されます (会話は世界観づくり、選択には影響しません)
- メッセージ表示中は画面タップ (または決定キー) で文字送り・次へ進みます
- マップは画面より広く、カメラが主人公についてスクロールします

## 技術構成

- Next.js (App Router) / TypeScript / React / Tailwind CSS
- PWA対応 (`src/app/manifest.ts`)。ホーム画面に追加して縦画面スタンドアロンで遊べます
- BGMはWeb Audioでコード生成 (音源ファイル不要)。画面右下の「♪」ボタンで再生

## ディレクトリ構成と人生の追加方法

人生データはコードに直接書かず、JSONファイルで管理しています。

```text
src/
  data/lives/          … 人生データ (JSON)。1ファイル = 1つの人生
    salaryman-1950.json
    samurai-1700.json
  lib/
    types.ts           … 人生データの型定義
    lives.ts           … 人生レジストリ (JSONを読み込んで一覧化)
    game.ts            … パラメータ計算などのゲームロジック
    useBgm.ts          … Web Audio によるBGM
  components/
    TitleScreen.tsx    … タイトル画面
    GameScreen.tsx     … 人生プレイ画面 (フィールド移動・マーカー・メッセージ)
    FieldMap.tsx       … スクロールする広いマップ + NPC/マーカー
    VirtualJoystick.tsx… アナログスティック
    EndingScreen.tsx   … エンディング (星評価 + 実際の歴史)
    PixelCharacter.tsx … ドット絵キャラ (歩行アニメ付き)
    StatsHud.tsx       … 幸福/財産/名声/家族のミニ表示
  hooks/
    useFieldMovement.ts … 移動ループ
    useNpcWander.ts       … NPCの徘徊AI
public/backgrounds/    … ドット絵背景 (bg-{id}.png)
```

新しい人生を追加する手順:

1. `src/data/lives/` に JSON を追加する (`types.ts` の `Life` 型に従う)
2. 必要なら `public/backgrounds/` に `bg-{背景ID}.png` を追加する
3. `src/lib/lives.ts` の `LIVES` 配列に1行追加する

選択肢マーカーの位置は自動配置されますが、JSONの各選択肢に `"position": { "x": 30, "y": 60 }` (背景に対する%座標) を書くと好きな場所に置けます。`npcs` 配列で歩き回る住人も追加できます。

これだけでタイトル画面に自動で並び、100種類以上の人生にも対応できます。

## パラメータ

各選択で「幸福・財産・名声・家族」(0〜10) が変化し、エンディングで星1〜5に換算して表示されます。
