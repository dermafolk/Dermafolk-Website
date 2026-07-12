"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type Settings } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";

import { useCart } from "@/components/cart-provider";

function money(value: number) {
  return `₹${value}`;
}

export function CartView({ settings }: { settings: Settings }) {
  const { items, subtotal, updateItem, removeItem } = useCart();
  const shipping = settings.shippingCharge;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <section className="section-pad">
        <div className="wrap">
          <div className="admin-card" style={{ maxWidth: "720px" }}>
            <h2>Your bag is empty</h2>
            <p>Add the Renewal Face Wash from the shop to continue.</p>
            <Button asChild className="btn btn-primary">
              <Link href="/shop">Go to Shop</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <div className="wrap">
        <div className="kicker">Cart</div>
        <h1 style={{ fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.05, marginBottom: "18px" }}>
          Review your order before checkout.
        </h1>
        <div className="split-grid" style={{ marginTop: "42px", alignItems: "start" }}>
          <div className="admin-stack">
            {items.map((item) => (
              <div className="admin-card" key={item.productId}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <img src={resolveMediaUrl(item.image)} alt={item.alt} style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "8px" }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "6px" }}>{item.name}</h3>
                    <p className="desc" style={{ marginBottom: "0" }}>{money(item.price)} each</p>
                  </div>
                  <strong>{money(item.price * item.qty)}</strong>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "16px", flexWrap: "wrap" }}>
                  <div className="qty-stepper">
                    <button type="button" onClick={() => updateItem(item.productId, Math.max(1, item.qty - 1))}>-</button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => updateItem(item.productId, Math.min(10, item.qty + 1))}>+</button>
                  </div>
                  <button type="button" className="btn btn-outline" onClick={() => removeItem(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="admin-card">
            <h2>Order summary</h2>
            <div className="admin-grid-two" style={{ marginTop: "18px" }}>
              <div><strong>Subtotal</strong><p>{money(subtotal)}</p></div>
              <div><strong>Shipping</strong><p>{money(shipping)}</p></div>
              <div><strong>Total</strong><p>{money(total)}</p></div>
            </div>
            <Button asChild className="btn btn-primary" style={{ marginTop: "16px", width: "100%" }}>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </aside>
        </div>
      </div>
    </section>
  );
}
