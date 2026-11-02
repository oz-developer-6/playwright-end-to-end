import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { MswGate } from "@/components/MswGate";
import "./globals.css";

const sans = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harbor — Playwright reference ledger",
  description:
    "A Next.js treasury app that demonstrates Playwright authentication, MSW, accessibility, and CI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--paper)] text-[var(--ink)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-[var(--ink)] focus:px-3 focus:py-2 focus:text-[var(--paper)]"
        >
          Skip to content
        </a>
        <MswGate>{children}</MswGate>
      </body>
    </html>
  );
}
