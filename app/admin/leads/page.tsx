import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Admin Leads - Dermafolk",
  description: "Contact lead management.",
};

export default function AdminLeadsPage() {
  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-card"><h2>Contact Leads</h2><p>No leads yet.</p></div>
      </section>
    </AdminShell>
  );
}
