"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { NetworkLab } from "@/components/NetworkLab";
import { SiteHeader } from "@/components/SiteHeader";
import type { MswScenario, SessionUser, Transfer } from "@/lib/types";

function statusLabel(status: Transfer["status"]) {
  if (status === "settled") return "Settled";
  if (status === "pending") return "Pending";
  return "Failed";
}

export default function DashboardPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [transfers, setTransfers] = useState<Transfer[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTransfers = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/transfers");
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setTransfers(null);
      setError(payload.error ?? "The ledger could not be loaded.");
      setLoading(false);
      return;
    }
    const payload = (await response.json()) as { transfers: Transfer[] };
    setTransfers(payload.transfers);
    setLoading(false);
  }, []);

  useEffect(() => {
    void (async () => {
      const session = await fetch("/api/auth/session");
      if (session.ok) {
        const payload = (await session.json()) as { user: SessionUser };
        setUser(payload.user);
      }
      await loadTransfers();
    })();
  }, [loadTransfers]);

  function onScenario(_scenario: MswScenario) {
    void loadTransfers();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader signedIn name={user?.name} />
      <main id="main" className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Studio ledger</p>
            <h1 className="mt-2 font-serif text-4xl">Welcome back{user ? `, ${user.name}` : ""}</h1>
          </div>
          <Link
            href="/dashboard/transfer"
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-[var(--paper)]"
          >
            New transfer
          </Link>
        </div>

        <NetworkLab onChange={onScenario} />

        <section aria-labelledby="transfers-heading" className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <h2 id="transfers-heading" className="font-serif text-2xl">
              Recent transfers
            </h2>
          </div>
          {loading ? (
            <p role="status" className="px-5 py-8 text-[var(--muted)]">
              Reconciling the ledger…
            </p>
          ) : null}
          {error ? (
            <p role="alert" aria-label={error} className="px-5 py-8 text-[var(--bad)]">
              {error}
            </p>
          ) : null}
          {!loading && !error && transfers?.length === 0 ? (
            <p className="px-5 py-8 text-[var(--muted)]">No transfers yet</p>
          ) : null}
          {!loading && !error && transfers && transfers.length > 0 ? (
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Recent Harbor transfers</caption>
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)]">
                  <th className="px-5 py-3 font-medium">Recipient</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Statement</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="border-b border-[var(--line)] last:border-b-0">
                    <td className="px-5 py-3">
                      <div>{transfer.recipient}</div>
                      <div className="text-[var(--muted)]">{transfer.note}</div>
                    </td>
                    <td className="px-5 py-3">${transfer.amount.toLocaleString()}</td>
                    <td className="px-5 py-3">{statusLabel(transfer.status)}</td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/invoice/${transfer.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Open statement
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      </main>
    </div>
  );
}
