"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { MSW_FLAG_KEY } from "@/lib/constants";

type MswContextValue = {
  ensureStarted: () => Promise<void>;
};

const MswContext = createContext<MswContextValue>({
  ensureStarted: async () => undefined,
});

export function useMsw() {
  return useContext(MswContext);
}

export function MswProvider({ children }: { children: ReactNode }) {
  const started = useRef<Promise<void> | null>(null);

  const ensureStarted = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(MSW_FLAG_KEY) === "off") return;
    if (process.env.NEXT_PUBLIC_ENABLE_MSW === "false") return;

    if (!started.current) {
      started.current = (async () => {
        const { worker } = await import("@/mocks/browser");
        await worker.start({
          onUnhandledFrame: "bypass",
          quiet: true,
          serviceWorker: { url: "/mockServiceWorker.js" },
        });
        window.__harborMswReady = true;
      })();
    }

    await started.current;
  }, []);

  const value = useMemo(() => ({ ensureStarted }), [ensureStarted]);

  return <MswContext.Provider value={value}>{children}</MswContext.Provider>;
}

declare global {
  interface Window {
    __harborMswReady?: boolean;
  }
}
