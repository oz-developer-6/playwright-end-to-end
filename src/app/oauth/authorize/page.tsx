"use client";

import { useState } from "react";
import { SSO_USER } from "@/lib/constants";

export default function OauthAuthorizePage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function approve() {
    setPending(true);
    setError("");
    const response = await fetch("/api/auth/sso", { method: "POST" });
    if (!response.ok) {
      setError("Northstar could not issue a session.");
      setPending(false);
      return;
    }

    window.opener?.postMessage(
      { type: "harbor-sso-success", email: SSO_USER.email },
      window.location.origin,
    );
    window.close();
  }

  return (
    <main id="main" className="grid min-h-screen place-items-center px-6">
      <section className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Northstar identity</p>
        <h1 className="mt-3 font-serif text-3xl">Approve Harbor access</h1>
        <p className="mt-3 text-[var(--muted)]">
          Sign in as {SSO_USER.name} ({SSO_USER.email}) and return to the opener window. Playwright
          listens for this popup with <code>page.waitForEvent(&apos;popup&apos;)</code>.
        </p>
        {error ? (
          <p role="alert" aria-label={error} className="mt-4 text-sm text-[var(--bad)]">
            {error}
          </p>
        ) : null}
        <div className="mt-6 grid gap-2">
          <button
            type="button"
            onClick={() => void approve()}
            disabled={pending}
            className="rounded-full bg-[var(--ink)] px-4 py-2.5 text-[var(--paper)]"
          >
            {pending ? "Approving…" : "Approve access"}
          </button>
          <button
            type="button"
            className="rounded-full border border-[var(--line)] px-4 py-2.5"
            onClick={() => window.close()}
          >
            Deny
          </button>
        </div>
      </section>
    </main>
  );
}
