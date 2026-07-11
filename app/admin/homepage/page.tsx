export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { HomepageCmsForm } from "@/components/homepage-cms-form";
import { getHomepageSections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Homepage CMS - Dermafolk",
  description: "Homepage CMS controls.",
};

export default async function AdminHomepagePage() {
  const sections = await getHomepageSections();

  return (
    <AdminShell>
      <HomepageCmsForm sections={sections} />
    </AdminShell>
  );
}
