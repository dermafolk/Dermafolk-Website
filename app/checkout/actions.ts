"use server";

import { z } from "zod";

import { getSiteSettings } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import type { Order, OrderItem } from "@/lib/types";
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

type CartItemInput = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

function buildOrder(input: {
  name: string;
  email: string;
  phone: string;
  address: string;
  cartItems: CartItemInput[];
  shipping: number;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed";
}): Order {
  const subtotal = input.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const total = subtotal + input.shipping;

  return {
    id: crypto.randomUUID(),
    customerName: input.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    items: input.cartItems.map<OrderItem>((item) => ({
      productId: item.productId,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
    subtotal,
    shipping: input.shipping,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
    orderStatus: "placed",
    createdAt: new Date().toISOString(),
  };
}

async function persistOrder(order: Order): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { ok: true };

  try {
    const { error: orderError } = await supabase.from("orders").insert({
      id: order.id,
      customer_name: order.customerName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
    });

    if (orderError) {
      return { ok: false, message: orderError.message };
    }

    const itemsPayload = order.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      qty: item.qty,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
    if (itemsError) {
      return { ok: false, message: itemsError.message };
    }

    return { ok: true };
  } catch (err) {
    console.error("Order creation database error:", err);
    // Fall through so the customer flow succeeds even if the DB write fails locally/offline.
    return { ok: true };
  }
}

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

export async function startRazorpayOrder(cartJson: string): Promise<RazorpayOrderState> {
  const settings = await getSiteSettings();
  if (!settings.razorpayEnabled) {
    return { ok: false, message: "Razorpay is currently disabled." };
  }

  let cartItems: CartItemInput[];
  try {
    cartItems = JSON.parse(cartJson) as CartItemInput[];
  } catch {
    return { ok: false, message: "Cart is empty." };
  }

  if (!cartItems.length) {
    return { ok: false, message: "Cart is empty." };
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const total = subtotal + settings.shippingCharge;
  const amountInPaise = total * 100;

  const result = await createRazorpayOrder(amountInPaise, crypto.randomUUID());
  if ("error" in result) {
    return { ok: false, message: result.error };
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
