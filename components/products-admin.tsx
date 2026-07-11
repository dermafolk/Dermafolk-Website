"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import type { Product } from "@/lib/types";
import { ProductForm } from "@/components/product-form";
import { DeleteProductButton } from "@/components/delete-product-button";

export function ProductsAdmin({ products }: { products: Product[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = products.find((p) => p.id === selectedId) ?? null;

  return (
    <section className="admin-stack">
      <div className="admin-card">
        <h2>Product Management</h2>
        <p>Create, edit, and remove products. Changes are saved to Supabase.</p>
      </div>

      <ProductForm key={selected?.id ?? "new"} product={selected ?? undefined} />

      <div className="admin-card">
        <h3>All products</h3>
        {products.length === 0 ? (
          <p className="desc">No products yet.</p>
        ) : (
          <div className="admin-stack" style={{ gap: "12px" }}>
            {products.map((p) => (
              <div key={p.id} className="admin-card admin-row">
                <div>
                  <strong>{p.name}</strong>
                  <p className="desc">
                    ₹{p.price}
                    {p.active ? null : <span style={{ color: "#b3261e" }}> · inactive</span>}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "8px 12px" }}
                    onClick={() => setSelectedId(p.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <DeleteProductButton id={p.id} name={p.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
