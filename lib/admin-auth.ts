import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";

import { env, hasAdminBootstrapEnv } from "@/lib/env";

const ADMIN_SESSION_COOKIE = "dermafolk_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  email: string;
  issuedAt: number;
  expiresAt: number;
};

function getSessionSecret() {
  return env.ADMIN_SESSION_SECRET ?? env.SUPABASE_SECRET_KEY ?? null;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: AdminSessionPayload, secret: string) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifyPayload(token: string, secret: string): AdminSessionPayload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return null;
  if (!timingSafeEqual(expectedBuffer, signatureBuffer)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AdminSessionPayload;
    if (
      !payload ||
      typeof payload.email !== "string" ||
      typeof payload.issuedAt !== "number" ||
      typeof payload.expiresAt !== "number"
    ) {
      return null;
    }

    if (payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(email: string, password: string) {
  if (!hasAdminBootstrapEnv()) return false;
  return email.trim().toLowerCase() === env.ADMIN_EMAIL?.trim().toLowerCase() && password === env.ADMIN_PASSWORD;
}

export function createAdminSessionToken(email: string) {
  const secret = getSessionSecret();
  if (!secret) return null;

  const now = Date.now();
  return signPayload(
    {
      email,
      issuedAt: now,
      expiresAt: now + ADMIN_SESSION_TTL_SECONDS * 1000,
    },
    secret,
  );
}

export async function getAdminSession() {
  const secret = getSessionSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  return verifyPayload(token, secret);
}

export async function setAdminSessionCookie(email: string) {
  const token = createAdminSessionToken(email);
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return true;
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
