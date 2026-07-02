import type { Metadata, Viewport } from "next";
import { DotGothic16 } from "next/font/google";
import { asset } from "@/lib/basePath";
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dot",
});

export const metadata: Metadata = {
  title: "LIFE JOURNEY",
  description: "歴史上のさまざまな人生を5〜10分で追体験するシミュレーションゲーム",
  manifest: asset("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    title: "LIFE JOURNEY",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${dotGothic.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950">{children}</body>
    </html>
  );
}
