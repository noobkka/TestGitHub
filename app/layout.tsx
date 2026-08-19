import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "星穹日历 — 崩坏：星穹铁道活动日程",
  description: "以简体中文查看《崩坏：星穹铁道》的活动、跃迁、重置与截止时间。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
