"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { fallbackSettings } from "@/lib/data";

import { createCodOrder, type CheckoutActionState } from "./actions";

function money(value: number) {
  return `₹${value}`;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const shipping = fallbackSettings.shippingCharge;
  const total = subtotal + shipping;
  const [state, formAction, pending] = useActionState<CheckoutActionState, FormData>(createCodOrder, {
    ok: false,
    message: "",
    order: null,
  });

  const orderDraft = useMemo(() => ({
    items,
    subtotal,
    shipping,
    total,
    paymentMethod,
  }), [items, subtotal, shipping, total, paymentMethod]);

  useEffect(() => {
    if (state.ok && state.order) {
      window.localStorage.setItem("dermafolk-last-order", JSON.stringify(state.order));
      clearCart();
      router.push("/order-confirmation");
    }
  }, [clearCart, router, state.ok, state.order]);

  if (!items.length) {
    return (
      <section className="section-pad">
        <div className="wrap">
          <div className="admin-card">
            <h2>Checkout</h2>
            <p>Your cart is empty.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <div className="wrap">
        <div className="kicker">Checkout</div>
        <h1 style={{ fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.05, marginBottom: "18px" }}>
          Complete your order details.
        </h1>
        <div className="split-grid" style={{ marginTop: "42px", alignItems: "start" }}>
          <form className="modal-card" style={{ maxWidth: "none" }} action={formAction}>
            <div className="field"><label>Name</label><input name="name" type="text" placeholder="Your name" /></div>
            <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" /></div>
            <div className="field"><label>Phone</label><input name="phone" type="tel" placeholder="Mobile number" /></div>
            <div className="field"><label>Address</label><textarea name="address" rows={4} placeholder="Delivery address" /></div>
            <input type="hidden" name="paymentMethod" value={paymentMethod} />
            <input type="hidden" name="cartJson" value={JSON.stringify(orderDraft.items)} />

            <div className="admin-card" style={{ marginBottom: "16px" }}>
              <h3>Payment method</h3>
              <label style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px" }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
              <label style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "10px", opacity: fallbackSettings.razorpayEnabled ? 1 : 0.5 }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  disabled={!fallbackSettings.razorpayEnabled}
                />
                Razorpay {fallbackSettings.razorpayEnabled ? "" : "(disabled)"}
              </label>
            </div>

            {state.message ? <p className="desc" style={{ marginBottom: "12px" }}>{state.message}</p> : null}
            <Button className="btn btn-primary modal-submit" type="submit" disabled={pending}>
              {pending ? "Placing..." : "Place Order"}
            </Button>
          </form>

          <aside className="admin-card">
            <h2>Summary</h2>
            {items.map((item) => (
              <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "14px" }}>
                <span>{item.name} x {item.qty}</span>
                <strong>{money(item.qty * item.price)}</strong>
              </div>
            ))}
            <hr style={{ borderColor: "rgba(0,0,0,0.08)", margin: "16px 0" }} />
            <div className="admin-grid-two">
              <div><strong>Subtotal</strong><p>{money(subtotal)}</p></div>
              <div><strong>Shipping</strong><p>{money(shipping)}</p></div>
              <div><strong>Total</strong><p>{money(total)}</p></div>
              <div><strong>Payment</strong><p>{paymentMethod === "cod" ? "COD" : "Razorpay"}</p></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
