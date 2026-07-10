"use server";

import { z } from "zod";

import { fallbackSettings } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Order, OrderItem } from "@/lib/types";
import { orderSchema } from "@/lib/validators";

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

  if (parsed.data.paymentMethod === "razorpay" && !fallbackSettings.razorpayEnabled) {
    return {
      ok: false,
      message: "Razorpay is currently disabled.",
      order: null,
    };
  }

  const cartItems = JSON.parse(parsed.data.cartJson) as Array<{
    productId: string;
    name: string;
    qty: number;
    price: number;
  }>;

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = fallbackSettings.shippingCharge;
  const total = subtotal + shipping;
  const orderId = crypto.randomUUID();
  const order: Order = {
    id: orderId,
    customerName: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    items: cartItems.map<OrderItem>((item) => ({
      productId: item.productId,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
    subtotal,
    shipping,
    total,
    paymentMethod: parsed.data.paymentMethod,
    paymentStatus: parsed.data.paymentMethod === "cod" ? "pending" : "paid",
    orderStatus: "placed",
    createdAt: new Date().toISOString(),
  };

  const validatedOrder = orderSchema.safeParse(order);
  if (!validatedOrder.success) {
    return {
      ok: false,
      message: validatedOrder.error.issues[0]?.message ?? "Invalid order.",
      order: null,
    };
  }

  const supabase = createServerSupabaseClient();
  if (supabase) {
    const { error: orderError } = await supabase.from("orders").insert({
      id: order.id,
      customer_name: validatedOrder.data.customerName,
      email: validatedOrder.data.email,
      phone: validatedOrder.data.phone,
      address: validatedOrder.data.address,
      subtotal: validatedOrder.data.subtotal,
      shipping: validatedOrder.data.shipping,
      total: validatedOrder.data.total,
      payment_method: validatedOrder.data.paymentMethod,
      payment_status: validatedOrder.data.paymentStatus,
      order_status: validatedOrder.data.orderStatus,
    });

    if (orderError) {
      return {
        ok: false,
        message: orderError.message,
        order: null,
      };
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
      return {
        ok: false,
        message: itemsError.message,
        order: null,
      };
    }
  }

  return {
    ok: true,
    message: "Order created.",
    order,
  };
}
