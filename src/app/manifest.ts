import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LIFE JOURNEY",
    short_name: "LIFE JOURNEY",
    description:
      "歴史上のさまざまな人生を5〜10分で追体験するシミュレーションゲーム",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
