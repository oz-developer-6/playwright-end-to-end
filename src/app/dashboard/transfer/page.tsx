"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import type { SessionUser } from "@/lib/types";

export default function TransferPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void (async () => {
      const session = await fetch("/api/auth/session");
      if (session.ok) {
        const payload = (await session.json()) as { user: SessionUser };
        setUser(payload.user);
      }
    })();
  }, []);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: formData.get("recipient"),
        email: formData.get("email"),
        amount: formData.get("amount"),
        note: formData.get("note"),
      }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Transfer did not post.");
      setPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader signedIn name={user?.name} />
      <main id="main" className="mx-auto w-full max-w-xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Outbound</p>
        <h1 className="mt-3 font-serif text-4xl">Send a transfer</h1>
        <form
          className="mt-8 grid gap-4 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(new FormData(event.currentTarget));
          }}
        >
          <div className="grid gap-1.5">
            <label htmlFor="recipient">Recipient name</label>
            <input
              id="recipient"
              name="recipient"
              required
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="email">Recipient email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="amount">Amount (USD)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              required
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="note">Note</label>
            <input
              id="note"
              name="note"
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            />
          </div>
          {error ? (
            <p role="alert" aria-label={error} className="text-sm text-[var(--bad)]">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-[var(--paper)] disabled:opacity-60"
          >
            {pending ? "Posting…" : "Post transfer"}
          </button>
        </form>
      </main>
    </div>
  );
}
