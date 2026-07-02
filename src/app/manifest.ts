import type { MetadataRoute } from "next";
import { asset } from "@/lib/basePath";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LIFE JOURNEY",
    short_name: "LIFE JOURNEY",
    description:
      "歴史上のさまざまな人生を5〜10分で追体験するシミュレーションゲーム",
    start_url: asset("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: asset("/icon.png"),
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
