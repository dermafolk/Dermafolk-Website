export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { LeadRow } from "@/components/lead-row";
import { getContactLeads } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Leads - Dermafolk",
  description: "Contact lead management.",
};

export default async function AdminLeadsPage() {
  const leads = await getContactLeads();

  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-card">
          <h2>Contact Leads</h2>
          <p className="desc">
            {leads.length === 0
              ? "No leads yet."
              : `${leads.length} lead${leads.length === 1 ? "" : "s"} received.`}
          </p>
        </div>
        {leads.map((lead) => (
          <LeadRow key={lead.id} lead={lead} />
        ))}
      </section>
    </AdminShell>
  );
}
