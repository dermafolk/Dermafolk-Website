import type { Metadata } from "next";

import { ProductPage } from "@/components/product-page";

export const metadata: Metadata = {
  title: "Dermafolk Renewal Serum - Product Details",
  description:
    "Product details, ingredients, quantity selection, shipping, and checkout information for Dermafolk Renewal Serum.",
};

export default function ShopPage() {
  return <ProductPage />;
}
