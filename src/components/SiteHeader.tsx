"use client";

import Link from "next/link";

export function SiteHeader({
  signedIn,
  name,
}: {
  signedIn?: boolean;
  name?: string;
}) {
  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between gap-6 border-b border-[var(--line)] px-6 py-4">
      <Link href={signedIn ? "/dashboard" : "/"} className="font-serif text-xl tracking-tight">
        Harbor
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-4 text-sm">
        {signedIn ? (
          <>
            <span className="hidden text-[var(--muted)] sm:inline">{name}</span>
            <Link className="hover:underline" href="/dashboard">
              Ledger
            </Link>
            <Link className="hover:underline" href="/dashboard/transfer">
              New transfer
            </Link>
            <button type="button" className="hover:underline" onClick={() => void signOut()}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link className="hover:underline" href="/login">
              Sign in
            </Link>
            <Link
              className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-[var(--paper)]"
              href="/signup"
            >
              Open an account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
