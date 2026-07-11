export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { OrderRow } from "@/components/order-row";
import { getOrders } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Orders - Dermafolk",
  description: "Order management.",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-card">
          <h2>Orders</h2>
          <p className="desc">
            {orders.length === 0
              ? "No orders placed yet."
              : `${orders.length} order${orders.length === 1 ? "" : "s"} placed.`}
          </p>
        </div>
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </section>
    </AdminShell>
  );
}
