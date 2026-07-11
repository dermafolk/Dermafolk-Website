export const dynamic = "force-dynamic";
import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { ProductsAdmin } from "@/components/products-admin";
import { getAllProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Products - Dermafolk",
  description: "Product management.",
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <AdminShell>
      <ProductsAdmin products={products} />
    </AdminShell>
  );
}
