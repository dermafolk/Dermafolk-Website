"use client";

import { useEffect, useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { Order } from "@/lib/types";
import { updateOrderStatusAction } from "@/app/admin/actions";

const STATUS_OPTIONS: { value: Order["orderStatus"]; label: string }[] = [
  { value: "placed", label: "Placed" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

const rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<Order["orderStatus"]>(order.orderStatus);
  const [state, formAction, pending] = useActionState(updateOrderStatusAction, {
    ok: false,
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state, router]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as Order["orderStatus"];
    setStatus(next);
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "status";
    input.value = next;
    formRef.current?.appendChild(input);
    formRef.current?.requestSubmit();
  }

  return (
    <div className="admin-card">
      <div className="admin-grid-two">
        <div>
          <div className="admin-kicker">Order</div>
          <p style={{ fontWeight: 600, marginTop: 4 }}>{order.id}</p>
          <div className="admin-kicker" style={{ marginTop: 12 }}>Placed</div>
          <p className="desc" style={{ marginTop: 4 }}>{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <div className="admin-kicker">Customer</div>
          <p style={{ marginTop: 4 }}>{order.customerName}</p>
          <p className="desc">{order.email}</p>
          <p className="desc">{order.phone}</p>
          <p className="desc" style={{ whiteSpace: "pre-wrap" }}>{order.address}</p>
        </div>
      </div>

      <div className="admin-kicker" style={{ marginTop: 16 }}>Items</div>
      <ul className="desc" style={{ marginTop: 4, paddingLeft: 18 }}>
        {order.items.map((item, index) => (
          <li key={`${item.productId}-${index}`}>
            {item.name} × {item.qty} @ {rupee.format(item.price)}
          </li>
        ))}
      </ul>

      <div className="admin-grid-two" style={{ marginTop: 12 }}>
        <div>
          <div className="admin-kicker">Payment</div>
          <p className="desc" style={{ marginTop: 4 }}>
            {order.paymentMethod === "cod" ? "COD" : "Razorpay"} · {order.paymentStatus}
          </p>
          <div className="admin-kicker" style={{ marginTop: 12 }}>Totals</div>
          <p className="desc" style={{ marginTop: 4 }}>
            Subtotal {rupee.format(order.subtotal)} · Shipping {rupee.format(order.shipping)} ·{" "}
            <strong>Total {rupee.format(order.total)}</strong>
          </p>
        </div>
        <div>
          <div className="admin-kicker">Order status</div>
          <form
            ref={formRef}
            action={formAction}
            style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <input type="hidden" name="id" value={order.id} />
            <select
              name="status"
              value={status}
              onChange={handleChange}
              disabled={pending}
              className="btn btn-outline"
              style={{ padding: "8px 12px" }}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          </form>
        </div>
      </div>

      {state.message ? (
        <p className="desc" style={{ color: state.ok ? "#1a7f37" : "#b3261e", marginTop: 12 }}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
