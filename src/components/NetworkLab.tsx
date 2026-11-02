"use client";

import { useEffect, useState } from "react";
import { useMsw } from "@/components/MswProvider";
import { MSW_SCENARIO_KEY } from "@/lib/constants";
import type { MswScenario } from "@/lib/types";

const OPTIONS: { id: MswScenario; label: string }[] = [
  { id: "live", label: "Live API" },
  { id: "slow", label: "Slow network" },
  { id: "server-error", label: "500 error" },
];

export function NetworkLab({ onChange }: { onChange: (scenario: MswScenario) => void }) {
  const { ensureStarted } = useMsw();
  const [scenario, setScenario] = useState<MswScenario>("live");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(MSW_SCENARIO_KEY);
    if (stored === "slow" || stored === "server-error" || stored === "live") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScenario(stored);
    }
  }, []);

  async function select(next: MswScenario) {
    setPending(true);
    window.localStorage.setItem(MSW_SCENARIO_KEY, next);
    setScenario(next);
    if (next !== "live") {
      await ensureStarted();
    }
    onChange(next);
    setPending(false);
  }

  return (
    <section
      aria-labelledby="network-lab-heading"
      className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">MSW lab</p>
          <h2 id="network-lab-heading" className="font-serif text-xl">
            Network conditions
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Mock network scenario">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={scenario === option.id}
              disabled={pending}
              className={`rounded-full px-3 py-1.5 text-sm ${
                scenario === option.id
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "border border-[var(--line)]"
              }`}
              onClick={() => void select(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
        Live traffic hits the Next.js API routes. Slow and 500 are intercepted in the browser by
        Mock Service Worker so Playwright can assert loading and error UI without changing app code.
      </p>
    </section>
  );
}
