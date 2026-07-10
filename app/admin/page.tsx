import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Admin - Dermafolk",
  description: "Dermafolk admin dashboard.",
};

export default function AdminHomePage() {
  return (
    <AdminShell>
      <section className="admin-grid">
        <div className="admin-card"><h2>Products</h2><p>1 active product</p></div>
        <div className="admin-card"><h2>Orders</h2><p>No live orders yet</p></div>
        <div className="admin-card"><h2>Leads</h2><p>0 unread leads</p></div>
        <div className="admin-card"><h2>Shipping</h2><p>Configured in settings</p></div>
      </section>
    </AdminShell>
  );
}
