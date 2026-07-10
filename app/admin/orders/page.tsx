import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Admin Orders - Dermafolk",
  description: "Order management.",
};

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-card"><h2>Orders</h2><p>No orders placed yet.</p></div>
      </section>
    </AdminShell>
  );
}
