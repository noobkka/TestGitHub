import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astral Calendar — Honkai: Star Rail events",
  description: "Track Star Rail events, warps, resets, and deadlines in your local time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
