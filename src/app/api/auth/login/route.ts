import { NextResponse } from "next/server";
import { applySessionCookie } from "@/lib/session";
import { getUserByEmail } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  const user = getUserByEmail(email);
  if (!user || !user.password || user.password !== password) {
    return NextResponse.json(
      { error: "Those credentials do not match a Harbor account." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
  return applySessionCookie(response, {
    id: user.id,
    name: user.name,
    email: user.email,
  });
}
