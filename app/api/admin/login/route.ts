import { NextResponse } from "next/server";

import { validateAdminCredentials, setAdminSessionCookie } from "@/lib/admin-auth";
import { hasAdminBootstrapEnv } from "@/lib/env";

export async function POST(request: Request) {
  if (!hasAdminBootstrapEnv()) {
    return NextResponse.json({ ok: false, message: "Admin bootstrap env is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ ok: false, message: "Invalid admin credentials." }, { status: 401 });
  }

  const tokenSet = await setAdminSessionCookie(email);
  if (!tokenSet) {
    return NextResponse.json({ ok: false, message: "Admin session secret is missing." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, message: "Signed in." });
}
