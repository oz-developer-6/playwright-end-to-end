import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getTransfer } from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await context.params;
  const transfer = getTransfer(id);
  if (!transfer) {
    return NextResponse.json({ error: "Transfer not found." }, { status: 404 });
  }

  return NextResponse.json({ transfer });
}
