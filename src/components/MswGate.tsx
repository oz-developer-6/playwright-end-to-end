"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const MswProvider = dynamic(
  () => import("@/components/MswProvider").then((mod) => mod.MswProvider),
  { ssr: false },
);

export function MswGate({ children }: { children: ReactNode }) {
  return <MswProvider>{children}</MswProvider>;
}
