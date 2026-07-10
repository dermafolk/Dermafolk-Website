import type { Metadata } from "next";

import { AdminShell } from "@/components/admin-shell";
import { fallbackProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Products - Dermafolk",
  description: "Product management.",
};

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <section className="admin-stack">
        <div className="admin-card">
          <h2>Product Management</h2>
          <p>Seeded from the shared fallback data until Supabase is connected.</p>
        </div>
        {fallbackProducts.map((product) => (
          <div key={product.id} className="admin-card admin-row">
            <div>
              <strong>{product.name}</strong>
              <p>{product.description}</p>
            </div>
            <span>₹{product.price}</span>
          </div>
        ))}
      </section>
    </AdminShell>
  );
}
