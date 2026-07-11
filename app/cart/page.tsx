export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/data";

import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Cart - Dermafolk",
  description: "Review items in your cart before checkout.",
};

export default async function CartPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell>
      <CartView settings={settings} />
    </SiteShell>
  );
}
