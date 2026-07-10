import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout - Dermafolk",
  description: "Enter your delivery details and choose a payment method.",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <CheckoutForm />
    </SiteShell>
  );
}
