import { NextResponse } from "next/server";
import { applySessionCookie } from "@/lib/session";
import { upsertSsoUser } from "@/lib/store";

export async function POST() {
  const user = upsertSsoUser();
  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
  return applySessionCookie(response, {
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
