import { NextResponse } from "next/server";

import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { markOrderPaidByRazorpayOrderId } from "@/lib/orders";

type RazorpayWebhookPayload = {
  event: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        notes?: Record<string, string>;
      };
    };
  };
};

export async function POST(request: Request) {
  // Signature is an HMAC over the raw body, so it must be read before any
  // JSON parsing - re-serializing a parsed object would not match.
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ ok: false, message: "Missing signature." }, { status: 400 });
  }

  const isValid = await verifyRazorpayWebhookSignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json({ ok: false, message: "Invalid signature." }, { status: 400 });
  }

  let event: RazorpayWebhookPayload;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid payload." }, { status: 400 });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id;
    const razorpayPaymentId = payment?.id;

    if (razorpayOrderId && razorpayPaymentId) {
      await markOrderPaidByRazorpayOrderId(razorpayOrderId, razorpayPaymentId);
    }
  }

  // Always acknowledge with 200 once the signature is verified - Razorpay
  // retries on non-2xx responses, and there's nothing useful a retry can
  // do about an order that genuinely doesn't exist in our database.
  return NextResponse.json({ ok: true });
}
