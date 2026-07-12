"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Product } from "@/lib/types";
import { CartPopup } from "@/components/cart-popup";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  alt: string;
};

export type CartPopupState = {
  isOpen: boolean;
  type: "bag" | "buynow";
  lastAdded: CartItem | null;
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  addItem: (
    product: Product,
    qty?: number,
    options?: { type?: "bag" | "buynow"; openPopup?: boolean },
  ) => void;
  updateItem: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  popupState: CartPopupState;
  openPopup: (type: "bag" | "buynow", item?: CartItem) => void;
  closePopup: () => void;
};

const CART_STORAGE_KEY = "dermafolk-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [popupState, setPopupState] = useState<CartPopupState>({
    isOpen: false,
    type: "bag",
    lastAdded: null,
  });

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

  const closePopup = useCallback(() => {
    setPopupState((current) => ({ ...current, isOpen: false }));
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    subtotal: items.reduce((total, item) => total + item.price * item.qty, 0),
    popupState,
    addItem(product, qty = 1, options = {}) {
      const addedItem: CartItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        qty,
        image: product.images[0]?.src ?? "",
        alt: product.images[0]?.alt ?? product.name,
      };

      setItems((current) => {
        const existing = current.find((item) => item.productId === product.id);
        if (existing) {
          return current.map((item) =>
            item.productId === product.id
              ? { ...item, qty: Math.min(10, item.qty + qty) }
              : item,
          );
        }
        return [...current, addedItem];
      });

      if (options.openPopup !== false) {
        setPopupState({
          isOpen: true,
          type: options.type ?? "bag",
          lastAdded: addedItem,
        });
      }
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
    openPopup(type, item) {
      setPopupState({
        isOpen: true,
        type,
        lastAdded: item ?? items[0] ?? null,
      });
    },
    closePopup,
  }), [items, popupState, closePopup]);

  const totalQty = useMemo(() => items.reduce((total, item) => total + item.qty, 0), [items]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartPopup
        popupState={popupState}
        closePopup={closePopup}
        subtotal={value.subtotal}
        totalQty={totalQty}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
