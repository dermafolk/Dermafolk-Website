"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Truck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { type Settings } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";
import { useCart } from "@/components/cart-provider";

function money(value: number) {
  return `₹${value}`;
}

export function CartView({ settings }: { settings: Settings }) {
  const { items, subtotal, updateItem, removeItem } = useCart();
  const shipping = settings.shippingCharge;
  const total = subtotal + shipping;
  const totalQty = items.reduce((acc, item) => acc + item.qty, 0);

  if (!items.length) {
    return (
      <section className="section-pad checkout-t min-h-[70vh] flex items-center justify-center">
        <div className="wrap w-full">
          <div className="rounded-3xl p-8 sm:p-12 max-w-lg mx-auto text-center border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] space-y-5">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto text-neutral-400 dark:text-neutral-500">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white m-0 text-center">
              Your Bag is Empty
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto m-0">
              Looks like you haven&apos;t added any items yet. Experience Dermafolk&apos;s one-bottle skin renewal.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-neutral-900 via-neutral-800 to-black dark:from-white dark:via-neutral-100 dark:to-neutral-200 dark:text-neutral-950 shadow-lg hover:shadow-xl hover:opacity-95 transition-all text-base no-underline"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad checkout-t">
      <div className="wrap">
        <div className="kicker">Shopping Bag</div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.08, marginBottom: "12px" }}>
          Review your items before checkout.
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg mb-10 max-w-2xl">
          Modify item quantities, unlock free delivery, and proceed when you&apos;re ready.
        </p>

        {/* Free Shipping Notification Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-medium">
            <strong className="text-emerald-700 dark:text-emerald-300 font-extrabold block sm:inline mr-1">
              🎉 Congratulations!
            </strong>
            You have unlocked <span className="font-bold underline decoration-emerald-500/50">Free Pan-India Express Shipping</span> on this order!
          </div>
        </div>

        {/* 
          Grid Layout: Items on LEFT (col-span-7), Summary on RIGHT (col-span-5).
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: CART ITEMS LIST */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white m-0">
                Bag Contents
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                {totalQty} {totalQty === 1 ? "Item" : "Items"}
              </span>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-2xl p-4 sm:p-6 border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={resolveMediaUrl(item.image)}
                    alt={item.alt}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-neutral-200/60 dark:border-white/10 shrink-0"
                  />

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 dark:text-white truncate m-0">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400">
                            120ml Bottle
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                            {money(item.price)} each
                          </span>
                        </div>
                      </div>
                      <strong className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white shrink-0">
                        {money(item.price * item.qty)}
                      </strong>
                    </div>

                    {/* Stepper & Remove Actions */}
                    <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-neutral-100 dark:border-white/5 flex-wrap">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center rounded-xl bg-neutral-100 dark:bg-white/10 p-1 border border-neutral-200/60 dark:border-white/5">
                        <button
                          type="button"
                          onClick={() => updateItem(item.productId, Math.max(1, item.qty - 1))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-2xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-neutral-900 dark:text-white select-none">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItem(item.productId, Math.min(10, item.qty + 1))}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-2xs"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove item</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY BOX */}
          <aside className="lg:col-span-5 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] sticky top-28">
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white m-0 pb-4 border-b border-neutral-100 dark:border-white/10">
              Order Summary
            </h2>

            {/* Price Breakdown */}
            <div className="mt-5 space-y-3.5 text-sm sm:text-base">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal ({totalQty} items)</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{money(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Express Shipping</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {shipping === 0 ? "FREE" : money(shipping)}
                </span>
              </div>
              <div className="pt-3.5 border-t border-dashed border-neutral-200 dark:border-white/15 flex items-center justify-between text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-xl sm:text-2xl text-neutral-900 dark:text-white">{money(total)}</span>
              </div>
            </div>

            {/* PROCEED TO CHECKOUT BUTTON */}
            <div className="mt-7">
              <Link
                href="/checkout"
                className="w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-neutral-900 via-neutral-800 to-black dark:from-white dark:via-neutral-100 dark:to-neutral-200 dark:text-neutral-950 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.45)] hover:opacity-95 transition-all flex items-center justify-center gap-2.5 text-base sm:text-xl group transform active:scale-[0.99] no-underline"
              >
                <span>Proceed to Checkout — {money(total)}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust Badges inside Summary */}
            <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Free Pan-India Express Shipping on all orders</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>45-Day 100% Risk-Free Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <span>256-bit SSL Bank-Grade Encrypted Checkout</span>
              </div>
            </div>

            {/* Secure Payment Logos */}
            <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/10 text-center">
              <img
                src={resolveMediaUrl("/assets/payment_logo.png")}
                alt="Secure Payment Options - UPI, Cards, NetBanking"
                className="h-10 sm:h-11 object-contain mx-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
