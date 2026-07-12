"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, CheckCircle2, Zap, ShoppingBag, ArrowRight, Truck, ShieldCheck, Lock } from "lucide-react";

import { resolveMediaUrl } from "@/lib/media";
import type { CartPopupState } from "@/components/cart-provider";

export function CartPopup({
  popupState,
  closePopup,
  subtotal,
  totalQty,
}: {
  popupState: CartPopupState;
  closePopup: () => void;
  subtotal: number;
  totalQty: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!popupState.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [popupState.isOpen, closePopup]);

  if (!popupState.isOpen || !popupState.lastAdded) return null;

  const item = popupState.lastAdded;
  const isBuyNow = popupState.type === "buynow";

  return (
    <div
      className="cart-popup-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePopup();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-popup-title"
    >
      <div className="cart-popup-modal">
        {/* Glowing Top Ribbon */}
        <div className={`cart-popup-bar ${isBuyNow ? "buynow" : "bag"}`} />

        <div className="p-6 sm:p-7">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              {isBuyNow ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Instant Buy & Checkout
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Added to Your Bag
                </span>
              )}

              <h3
                id="cart-popup-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mt-2.5"
              >
                {isBuyNow ? "Ready to Checkout! 🚀" : "Item Added Successfully! ✨"}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {isBuyNow
                  ? "We've reserved your item for instant 1-click checkout below."
                  : "Your item is safely added. Continue browsing or proceed below."}
              </p>
            </div>

            <button
              onClick={closePopup}
              type="button"
              aria-label="Close popup"
              className="p-2 -mr-2 -mt-2 rounded-full text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Summary Card */}
          <div className="mt-5 p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/80 dark:border-white/10 flex items-center gap-4 shadow-sm">
            <img
              src={resolveMediaUrl(item.image)}
              alt={item.alt || item.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-white border border-neutral-200/60 dark:border-white/10 shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-white truncate">
                {item.name}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                <span className="px-2 py-0.5 rounded-md bg-neutral-200/80 dark:bg-white/10 font-semibold text-neutral-800 dark:text-neutral-200">
                  Qty: {item.qty}
                </span>
                <span>× ₹{item.price}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                <span className="font-extrabold text-lg sm:text-xl text-neutral-900 dark:text-white">
                  ₹{item.price * item.qty}
                </span>
               
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 py-4 mt-2 border-t border-b border-neutral-100 dark:border-white/10 text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <div className="flex flex-col items-center justify-center gap-1">
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>45-Day Refund</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Secure 256-bit</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-5">
            <Link
              href="/checkout"
              onClick={closePopup}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-neutral-900 via-neutral-800 to-black dark:from-white dark:via-neutral-100 dark:to-neutral-200 dark:text-neutral-950 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] hover:opacity-95 transition-all flex items-center justify-center gap-2.5 text-base sm:text-lg group transform active:scale-[0.99] no-underline"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={closePopup}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15 transition-all text-sm sm:text-base flex items-center justify-center gap-1.5 no-underline"
              >
                <span>View Bag ({totalQty})</span>
              </Link>

              <button
                onClick={closePopup}
                type="button"
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl font-semibold text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/15 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all text-sm sm:text-base flex items-center justify-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
