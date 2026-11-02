import { NextResponse } from "next/server";
import { applySessionCookie } from "@/lib/session";
import { createUser } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (name.length < 2 || !email.includes("@") || password.length < 8) {
    return NextResponse.json(
      { error: "Name, a valid email, and an 8+ character password are required." },
      { status: 400 },
    );
  }

  try {
    const user = createUser({ name, email, password });
    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
    return applySessionCookie(response, {
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create account." },
      { status: 409 },
    );
  }
}
