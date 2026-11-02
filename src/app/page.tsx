import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const capabilities = [
  {
    title: "Persistent auth",
    body: "Log in once, save storageState, and reuse the session across the suite.",
  },
  {
    title: "MSW edge cases",
    body: "Intercept /api/transfers in the browser to force slowness or a 500 without backend changes.",
  },
  {
    title: "Multi-tab + SSO",
    body: "Open statements in a new tab and complete a popup OAuth handshake in one context.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
        <section className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Playwright reference system
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight">
            A small treasury with a production-shaped test harness.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
            Harbor is a Next.js App Router ledger. The interesting part is not the product — it is
            how Playwright, MSW, Axe, Allure, and GitHub Actions are wired around it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-[var(--paper)]"
            >
              Sign in to the ledger
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-[var(--line)] px-5 py-2.5"
            >
              Create an account
            </Link>
          </div>
        </section>
        <section aria-labelledby="capability-heading" className="grid gap-4 md:grid-cols-3">
          <h2 id="capability-heading" className="sr-only">
            What the test suite demonstrates
          </h2>
          {capabilities.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5"
            >
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
