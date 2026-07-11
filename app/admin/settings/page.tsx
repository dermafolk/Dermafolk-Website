export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { SettingsForm } from "@/components/settings-form";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Settings - Dermafolk",
  description: "Shipping and payment settings.",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell>
      <SettingsForm settings={settings} />
    </AdminShell>
  );
}
