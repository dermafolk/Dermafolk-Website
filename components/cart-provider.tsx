"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

  // Each cart method is its own stable useCallback rather than an inline
  // property on a single `items`-dependent useMemo. Previously, calling
  // clearCart() changed `items`, which recreated every method (including
  // clearCart itself) with a new identity - any effect elsewhere that
  // depended on `clearCart` (e.g. the checkout success handler) would then
  // re-fire, call clearCart() again, and loop forever ("Maximum update
  // depth exceeded", freezing the app right after checkout).
  const addItem = useCallback(
    (
      product: Product,
      qty = 1,
      options: { type?: "bag" | "buynow"; openPopup?: boolean } = {},
    ) => {
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

      if (options.type === "buynow") {
        setPopupState((current) => ({ ...current, isOpen: false }));
        router.push("/checkout");
      } else if (options.openPopup !== false) {
        setPopupState({
          isOpen: true,
          type: options.type ?? "bag",
          lastAdded: addedItem,
        });
      }
    },
    [router],
  );

  const updateItem = useCallback((productId: string, qty: number) => {
    setItems((current) =>
      current
        .map((item) => (item.productId === productId ? { ...item, qty } : item))
        .filter((item) => item.qty > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openPopup = useCallback(
    (type: "bag" | "buynow", item?: CartItem) => {
      if (type === "buynow") {
        setPopupState((current) => ({ ...current, isOpen: false }));
        router.push("/checkout");
        return;
      }
      setPopupState({
        isOpen: true,
        type,
        lastAdded: item ?? items[0] ?? null,
      });
    },
    [router, items],
  );

  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.qty, 0), [items]);
  const totalQty = useMemo(() => items.reduce((total, item) => total + item.qty, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      subtotal,
      popupState,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      openPopup,
      closePopup,
    }),
    [items, subtotal, popupState, addItem, updateItem, removeItem, clearCart, openPopup, closePopup],
  );

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
