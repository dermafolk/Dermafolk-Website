import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { fallbackSections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Homepage CMS - Dermafolk",
  description: "Homepage CMS controls.",
};

export default function AdminHomepagePage() {
  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-card">
          <h2>Homepage CMS</h2>
          <p>Static placeholders for hero banners and featured sections.</p>
        </div>
        {fallbackSections.map((section) => (
          <div key={section.key} className="admin-card">
            <strong>{section.title}</strong>
            <p>{section.body}</p>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}
