export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";
import { getSiteSettings } from "@/lib/data";

import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout - Dermafolk",
  description: "Enter your delivery details and choose a payment method.",
};

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <SiteShell>
      <CheckoutForm settings={settings} />
    </SiteShell>
  );
}
