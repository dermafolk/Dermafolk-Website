"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Product } from "@/lib/types";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  alt: string;
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  addItem: (product: Product, qty?: number) => void;
  updateItem: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "dermafolk-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw) as CartItem[]);
      }
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore persistence errors in development.
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    subtotal: items.reduce((total, item) => total + item.price * item.qty, 0),
    addItem(product, qty = 1) {
      setItems((current) => {
        const existing = current.find((item) => item.productId === product.id);
        if (existing) {
          return current.map((item) =>
            item.productId === product.id
              ? { ...item, qty: Math.min(10, item.qty + qty) }
              : item,
          );
        }
        return [
          ...current,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            qty,
            image: product.images[0]?.src ?? "",
            alt: product.images[0]?.alt ?? product.name,
          },
        ];
      });
    },
    updateItem(productId, qty) {
      setItems((current) =>
        current
          .map((item) => (item.productId === productId ? { ...item, qty } : item))
          .filter((item) => item.qty > 0),
      );
    },
    removeItem(productId) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    },
    clearCart() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
