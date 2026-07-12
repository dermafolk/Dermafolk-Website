export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { getContactLeads, getOrders } from "@/lib/data";
import { LeadRow } from "@/components/lead-row";

export const metadata: Metadata = {
  title: "Admin - Dermafolk",
  description: "Dermafolk admin dashboard.",
};

export default async function AdminHomePage() {
  const leads = await getContactLeads();
  const orders = await getOrders();

  const unhandledLeads = leads.filter((l) => l.status !== "handled");

  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-grid">
          <div className="admin-card"><h2>Products</h2><p className="desc mt-1">1 active product</p></div>
          <div className="admin-card"><h2>Orders</h2><p className="desc mt-1">{orders.length} order{orders.length === 1 ? "" : "s"} received</p></div>
          <div className="admin-card"><h2>Leads & Subscribers</h2><p className="desc mt-1 font-bold text-emerald-600 dark:text-emerald-400">{leads.length} total ({unhandledLeads.length} new)</p></div>
          <div className="admin-card"><h2>Shipping</h2><p className="desc mt-1">Configured in settings</p></div>
        </div>

        <div className="admin-card mt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold">Recent Leads & Newsletter Subscribers</h2>
              <p className="desc mt-1">Latest messages and email subscriptions submitted on the site.</p>
            </div>
            <a href="/admin/leads" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "14px", textDecoration: "none" }}>View All ({leads.length})</a>
          </div>
        </div>

        {leads.slice(0, 3).map((lead) => (
          <LeadRow key={lead.id} lead={lead} />
        ))}
      </section>
    </AdminShell>
  );
}
