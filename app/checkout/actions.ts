"use server";

import { z } from "zod";

import { getSiteSettings } from "@/lib/data";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import { buildOrder, markOrderPaidByRazorpayOrderId, persistOrder, type CartItemInput } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { orderSchema, razorpayVerifySchema } from "@/lib/validators";

export type CheckoutActionState = {
  ok: boolean;
  message: string;
  order: Order | null;
};

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  address: z.string().trim().min(10, "Enter a delivery address."),
  paymentMethod: z.enum(["cod", "razorpay"]),
  cartJson: z.string().trim().min(2, "Cart is empty."),
});

export async function createCodOrder(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    paymentMethod: formData.get("paymentMethod"),
    cartJson: formData.get("cartJson"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the checkout form.",
      order: null,
    };
  }

  if (parsed.data.paymentMethod !== "cod") {
    return {
      ok: false,
      message: "Use the Razorpay flow for online payments.",
      order: null,
    };
  }

  const settings = await getSiteSettings();
  const cartItems = JSON.parse(parsed.data.cartJson) as CartItemInput[];

  const order = buildOrder({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    cartItems,
    shipping: settings.shippingCharge,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "placed",
  });

  const validatedOrder = orderSchema.safeParse(order);
  if (!validatedOrder.success) {
    return {
      ok: false,
      message: validatedOrder.error.issues[0]?.message ?? "Invalid order.",
      order: null,
    };
  }

  const persisted = await persistOrder(order);
  if (!persisted.ok) {
    return { ok: false, message: persisted.message, order: null };
  }

  return {
    ok: true,
    message: "Order created.",
    order,
  };
}

export type RazorpayOrderState =
  | { ok: true; keyId: string; razorpayOrderId: string; amount: number; currency: string }
  | { ok: false; message: string };

const startRazorpaySchema = z.object({
  name: z.string().trim().min(2, "Enter a name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  address: z.string().trim().min(10, "Enter a delivery address."),
  cartJson: z.string().trim().min(2, "Cart is empty."),
});

export async function startRazorpayOrder(input: {
  name: string;
  email: string;
  phone: string;
  address: string;
  cartJson: string;
}): Promise<RazorpayOrderState> {
  const parsed = startRazorpaySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the checkout form." };
  }

  const settings = await getSiteSettings();
  if (!settings.razorpayEnabled) {
    return { ok: false, message: "Razorpay is currently disabled." };
  }

  let cartItems: CartItemInput[];
  try {
    cartItems = JSON.parse(parsed.data.cartJson) as CartItemInput[];
  } catch {
    return { ok: false, message: "Cart is empty." };
  }

  if (!cartItems.length) {
    return { ok: false, message: "Cart is empty." };
  }

  // Create the order record up front, in "draft" status, so that a Razorpay
  // webhook can independently create/confirm the paid order even if the
  // customer's browser never makes it back to us with a success callback
  // (closed tab, crash, dropped connection, etc).
  const draftOrder = buildOrder({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    cartItems,
    shipping: settings.shippingCharge,
    paymentMethod: "razorpay",
    paymentStatus: "pending",
    orderStatus: "draft",
  });

  const amountInPaise = draftOrder.total * 100;

  const result = await createRazorpayOrder(amountInPaise, draftOrder.id, { orderId: draftOrder.id });
  if ("error" in result) {
    return { ok: false, message: result.error };
  }

  draftOrder.razorpayOrderId = result.orderId;

  const persisted = await persistOrder(draftOrder);
  if (!persisted.ok) {
    return { ok: false, message: persisted.message };
  }

  return {
    ok: true,
    keyId: result.keyId,
    razorpayOrderId: result.orderId,
    amount: result.amount,
    currency: result.currency,
  };
}

export async function completeRazorpayOrder(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const parsed = razorpayVerifySchema.safeParse({
    razorpayOrderId: formData.get("razorpayOrderId"),
    razorpayPaymentId: formData.get("razorpayPaymentId"),
    razorpaySignature: formData.get("razorpaySignature"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    cartJson: formData.get("cartJson"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the checkout form.",
      order: null,
    };
  }

  const isValid = await verifyRazorpaySignature(
    parsed.data.razorpayOrderId,
    parsed.data.razorpayPaymentId,
    parsed.data.razorpaySignature,
  );

  if (!isValid) {
    return {
      ok: false,
      message: "Payment verification failed. If you were charged, contact support with your payment ID.",
      order: null,
    };
  }

  // The draft order created in startRazorpayOrder should already exist -
  // this just flips it to paid (or is a no-op if the webhook already did).
  const existingOrder = await markOrderPaidByRazorpayOrderId(
    parsed.data.razorpayOrderId,
    parsed.data.razorpayPaymentId,
  );

  if (existingOrder) {
    return { ok: true, message: "Payment successful.", order: existingOrder };
  }

  // Fallback for when no DB is configured (local/offline dev) - the draft
  // order was never persisted, so build and return one in-memory instead.
  const settings = await getSiteSettings();
  const cartItems = JSON.parse(parsed.data.cartJson) as CartItemInput[];

  const order = buildOrder({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    cartItems,
    shipping: settings.shippingCharge,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    orderStatus: "placed",
    razorpayOrderId: parsed.data.razorpayOrderId,
    razorpayPaymentId: parsed.data.razorpayPaymentId,
  });

  const validatedOrder = orderSchema.safeParse(order);
  if (!validatedOrder.success) {
    return {
      ok: false,
      message: validatedOrder.error.issues[0]?.message ?? "Invalid order.",
      order: null,
    };
  }

  const persisted = await persistOrder(order);
  if (!persisted.ok) {
    return { ok: false, message: persisted.message, order: null };
  }

  return {
    ok: true,
    message: "Payment successful.",
    order,
  };
}
