"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { DEMO_USER } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? "Sign in failed.");
      setPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function openSso() {
    const popup = window.open(
      "/oauth/authorize",
      "northstar-sso",
      "width=480,height=640",
    );
    if (!popup) {
      setError("The SSO window was blocked. Allow pop-ups for this demo.");
      return;
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "harbor-sso-success") {
        window.removeEventListener("message", onMessage);
        router.push("/dashboard");
        router.refresh();
      }
    }

    window.addEventListener("message", onMessage);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto grid w-full max-w-5xl flex-1 gap-12 px-6 py-16 lg:grid-cols-2">
        <section>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Members</p>
          <h1 className="mt-3 font-serif text-4xl">Sign in to Harbor</h1>
          <p className="mt-3 text-[var(--muted)]">
            Demo account: {DEMO_USER.email} / {DEMO_USER.password}
          </p>
        </section>
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit(new FormData(event.currentTarget));
            }}
          >
            <div className="grid gap-1.5">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
                defaultValue={DEMO_USER.email}
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-2"
                defaultValue={DEMO_USER.password}
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
              {pending ? "Signing in…" : "Sign in to Harbor"}
            </button>
          </form>
          <div className="mt-6 border-t border-[var(--line)] pt-6">
            <button
              type="button"
              onClick={() => void openSso()}
              className="w-full rounded-full border border-[var(--line)] px-4 py-2.5"
            >
              Continue with Northstar SSO
            </button>
            <p className="mt-3 text-sm text-[var(--muted)]">
              No account?{" "}
              <Link className="underline" href="/signup">
                Open one
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
