import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

import { createServerSupabaseClient } from "@/lib/supabase";
import { SETTINGS_ID } from "@/lib/data";

export type RazorpayCredentials = {
  keyId: string;
  keySecret: string;
};

// This must only ever be imported from server actions / route handlers.
// The `server-only` import above makes any accidental client-component
// import a build-time error instead of a runtime secret leak.
export async function getRazorpayCredentials(): Promise<RazorpayCredentials | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("razorpay_key_id, razorpay_key_secret, razorpay_enabled")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error || !data || !data.razorpay_enabled) return null;
  if (!data.razorpay_key_id || !data.razorpay_key_secret) return null;

  return { keyId: data.razorpay_key_id, keySecret: data.razorpay_key_secret };
}

export type RazorpayOrderResult =
  | { error: string }
  | { keyId: string; orderId: string; amount: number; currency: string };

export async function createRazorpayOrder(
  amountInPaise: number,
  receipt: string,
  notes?: Record<string, string>,
): Promise<RazorpayOrderResult> {
  const credentials = await getRazorpayCredentials();
  if (!credentials) {
    return { error: "Razorpay is not configured." };
  }

  const auth = Buffer.from(`${credentials.keyId}:${credentials.keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("[razorpay] order creation failed:", response.status, body);
    return { error: "Could not start payment. Please try again." };
  }

  const order = (await response.json()) as { id: string; amount: number; currency: string };

  return {
    keyId: credentials.keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
}

export async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const credentials = await getRazorpayCredentials();
  if (!credentials) return false;

  const expected = createHmac("sha256", credentials.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return safeEqualHex(expected, signature);
}

function safeEqualHex(expectedHex: string, actualHex: string) {
  const expectedBuffer = Buffer.from(expectedHex);
  const actualBuffer = Buffer.from(actualHex);
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

// The webhook signature is a distinct secret configured separately in the
// Razorpay dashboard's Webhooks section - not the same as key_secret.
async function getRazorpayWebhookSecret(): Promise<string | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("razorpay_webhook_secret")
    .eq("id", SETTINGS_ID)
    .maybeSingle();

  if (error || !data?.razorpay_webhook_secret) return null;
  return data.razorpay_webhook_secret;
}

// `rawBody` must be the exact, unparsed request body - the signature is an
// HMAC over the raw bytes, so parsing to JSON first would break verification.
export async function verifyRazorpayWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
  const secret = await getRazorpayWebhookSecret();
  if (!secret) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
