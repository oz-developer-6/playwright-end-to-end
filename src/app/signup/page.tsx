"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Could not create the account.");
      setPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">New studio</p>
        <h1 className="mt-3 font-serif text-4xl">Open a Harbor account</h1>
        <form
          className="mt-8 grid gap-4 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(new FormData(event.currentTarget));
          }}
        >
          <div className="grid gap-1.5">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
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
            className="rounded-full bg-[var(--ink)] px-4 py-2.5 text-[var(--paper)] disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
          <p className="text-sm text-[var(--muted)]">
            Already on the ledger?{" "}
            <Link className="underline" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
