"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

type OrderRecord = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
};

function money(value: number) {
  return `₹${value}`;
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("dermafolk-last-order");
      if (raw) {
        setOrder(JSON.parse(raw) as OrderRecord);
      }
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <SiteShell>
      <section className="section-pad">
        <div className="wrap">
          <div className="admin-card" style={{ maxWidth: "720px" }}>
            <h1>Order confirmed</h1>
            {order ? (
              <>
                <p>Thanks, {order.customerName}. Your order {order.id} has been placed.</p>
                <div className="admin-grid-two" style={{ marginTop: "18px" }}>
                  <div><strong>Total</strong><p>{money(order.total)}</p></div>
                  <div><strong>Payment</strong><p>{order.paymentMethod}</p></div>
                  <div><strong>Status</strong><p>{order.paymentStatus}</p></div>
                  <div><strong>Delivery</strong><p>{order.orderStatus}</p></div>
                </div>
              </>
            ) : (
              <p>No recent order was found in this browser.</p>
            )}
            <Button asChild className="btn btn-primary" style={{ marginTop: "18px" }}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
