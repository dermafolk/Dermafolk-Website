export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { ProductPage } from "@/components/product-page";
import { fallbackProducts, getProductBySlug } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dermafolk Renewal Face Wash - Product Details",
  description:
    "Product details, ingredients, quantity selection, shipping, and checkout information for Dermafolk Renewal Face Wash.",
};

export default async function ShopPage() {
  const product = (await getProductBySlug("renewal-serum")) ?? fallbackProducts[0];

  return <ProductPage product={product} />;
}
