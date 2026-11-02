import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createTransfer, listTransfers } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  return NextResponse.json({ transfers: listTransfers() });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await request.json()) as {
    recipient?: string;
    email?: string;
    amount?: number | string;
    note?: string;
  };

  const recipient = body.recipient?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const amount = Number(body.amount);
  const note = body.note?.trim() ?? "";

  if (recipient.length < 2 || !email.includes("@") || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Recipient, email, and a positive amount are required." },
      { status: 400 },
    );
  }

  const transfer = createTransfer({ recipient, email, amount, note });
  return NextResponse.json({ transfer }, { status: 201 });
}
