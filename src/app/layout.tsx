import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChronoTrace AI — Autonomous Video-to-Bug Archaeology & Self-Healing Engine",
  description: "Reverse-engineer user screen recordings into deterministic AST coordinates, Playwright reproduction tests, and verified self-healing diffs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080b11] text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
