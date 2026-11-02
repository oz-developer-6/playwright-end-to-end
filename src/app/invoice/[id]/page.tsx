import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getTransfer } from "@/lib/store";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const transfer = getTransfer(id);
  if (!transfer) notFound();

  return (
    <main id="main" className="mx-auto min-h-screen max-w-2xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Harbor statement</p>
      <h1 className="mt-3 font-serif text-4xl">Statement</h1>
      <p className="mt-2 text-[var(--muted)]">Prepared for {user.name}</p>
      <article className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8">
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-[var(--muted)]">Recipient</dt>
            <dd>{transfer.recipient}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">Email</dt>
            <dd>{transfer.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">Amount</dt>
            <dd>${transfer.amount.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">Status</dt>
            <dd>{transfer.status}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">Reference</dt>
            <dd>{transfer.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">Note</dt>
            <dd>{transfer.note || "—"}</dd>
          </div>
        </dl>
      </article>
    </main>
  );
}
