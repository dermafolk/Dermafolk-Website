import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Cart - Dermafolk",
  description: "Review items in your cart before checkout.",
};

export default function CartPage() {
  return (
    <SiteShell>
      <CartView />
    </SiteShell>
  );
}
