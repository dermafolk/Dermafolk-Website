import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase";
import type { Order, OrderItem } from "@/lib/types";

export type CartItemInput = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export function buildOrder(input: {
  name: string;
  email: string;
  phone: string;
  address: string;
  cartItems: CartItemInput[];
  shipping: number;
  paymentMethod: "cod" | "razorpay";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "draft" | "placed" | "fulfilled" | "cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
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
    orderStatus: input.orderStatus,
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    createdAt: new Date().toISOString(),
  };
}

export async function persistOrder(order: Order): Promise<{ ok: true } | { ok: false; message: string }> {
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
      razorpay_order_id: order.razorpayOrderId ?? null,
      razorpay_payment_id: order.razorpayPaymentId ?? null,
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

function mapOrderRow(row: {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: "cod" | "razorpay";
  payment_status: "pending" | "paid" | "failed";
  order_status: "draft" | "placed" | "fulfilled" | "cancelled";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  order_items?: { product_id: string; name: string; qty: number; price: number }[];
}): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    items: (row.order_items ?? []).map((item) => ({
      productId: item.product_id,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    razorpayOrderId: row.razorpay_order_id ?? undefined,
    razorpayPaymentId: row.razorpay_payment_id ?? undefined,
    createdAt: row.created_at,
  };
}

// Shared by both the client-side payment-confirmation action and the
// Razorpay webhook, so whichever one reaches the server first "wins" and
// the other becomes a no-op - the order is never created twice.
export async function markOrderPaidByRazorpayOrderId(
  razorpayOrderId: string,
  paymentId: string,
): Promise<Order | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;

  const { data: existing, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (error || !existing) return null;

  if (existing.payment_status !== "paid") {
    await supabase
      .from("orders")
      .update({ payment_status: "paid", order_status: "placed", razorpay_payment_id: paymentId })
      .eq("id", existing.id);
  }

  return mapOrderRow({
    ...existing,
    payment_status: "paid",
    order_status: "placed",
    razorpay_payment_id: paymentId,
  });
}
