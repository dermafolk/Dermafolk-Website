import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { fallbackSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Settings - Dermafolk",
  description: "Shipping and payment settings.",
};

export default function AdminSettingsPage() {
  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-card">
          <h2>Shipping and Payment Settings</h2>
          <p>Razorpay is disabled by default until client setup is complete.</p>
        </div>
        <div className="admin-card admin-grid-two">
          <div><strong>Shipping charge</strong><p>₹{fallbackSettings.shippingCharge}</p></div>
          <div><strong>COD</strong><p>{fallbackSettings.codEnabled ? "Enabled" : "Disabled"}</p></div>
          <div><strong>Razorpay</strong><p>{fallbackSettings.razorpayEnabled ? "Enabled" : "Disabled"}</p></div>
        </div>
      </section>
    </AdminShell>
  );
}
