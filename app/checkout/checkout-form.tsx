"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Truck,
  Banknote,
  CreditCard,
  CheckCircle2,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { type Settings } from "@/lib/types";
import { resolveMediaUrl } from "@/lib/media";

import { createCodOrder, type CheckoutActionState } from "./actions";

function money(value: number) {
  return `₹${value}`;
}

export function CheckoutForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const shipping = settings.shippingCharge;
  const total = subtotal + shipping;
  const [state, formAction, pending] = useActionState<CheckoutActionState, FormData>(createCodOrder, {
    ok: false,
    message: "",
    order: null,
  });

  const orderDraft = useMemo(() => ({
    items,
    subtotal,
    shipping,
    total,
    paymentMethod,
  }), [items, subtotal, shipping, total, paymentMethod]);

  useEffect(() => {
    if (state.ok && state.order) {
      window.localStorage.setItem("dermafolk-last-order", JSON.stringify(state.order));
      clearCart();
      router.push("/order-confirmation");
    }
  }, [clearCart, router, state.ok, state.order]);

  if (!items.length) {
    return (
      <section className="section-pad">
        <div className="wrap">
          <div className="admin-card" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <h2 className="text-2xl font-bold mb-3">Your Bag is Empty</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              You don&apos;t have any items in your bag yet. Add the Renewal Face Wash to get started.
            </p>
            <Button
              type="button"
              className="btn btn-primary"
              onClick={() => router.push("/shop")}
            >
              Explore Products
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad checkout-t">
      <div className="wrap">
        <div className="kicker">Checkout</div>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.08, marginBottom: "12px" }}>
          Complete your order details.
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg mb-10 max-w-2xl">
          Review your items on the left and provide your shipping address to finalize your order.
        </p>

        {/* 
          Grid Layout: Summary on LEFT (col-span-5), Form on RIGHT (col-span-7).
          Using standard CSS/Tailwind grid so both columns stretch nicely with NO inner form scrollbar.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: ORDER SUMMARY */}
          <aside className="lg:col-span-5 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] sticky top-28 order-2 lg:order-1">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-white/10">
              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white m-0">
                Order Summary
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                {items.reduce((acc, item) => acc + item.qty, 0)} Item(s)
              </span>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3.5 pb-3.5 border-b border-neutral-100 dark:border-white/5 last:border-0 last:pb-0">
                  <img
                    src={resolveMediaUrl(item.image)}
                    alt={item.alt}
                    className="w-16 h-16 sm:w-18 sm:h-18 object-cover rounded-2xl border border-neutral-200/60 dark:border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Qty: {item.qty} × {money(item.price)}
                    </p>
                  </div>
                  <strong className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">
                    {money(item.qty * item.price)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 pt-5 border-t border-neutral-200/80 dark:border-white/10 space-y-3 text-sm">
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{money(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Shipping</span>
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {shipping === 0 ? "FREE" : money(shipping)}
                </span>
              </div>
              <div className="pt-3 border-t border-dashed border-neutral-200 dark:border-white/15 flex items-center justify-between text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-xl sm:text-2xl text-neutral-900 dark:text-white">{money(total)}</span>
              </div>
            </div>

            {/* Trust & Guarantee Box */}
            <div className="mt-6 p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>45-Day Risk-Free Money Back Guarantee</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed pl-7">
                If Dermafolk isn&apos;t the last face wash you ever buy, we give you a full refund with zero hassle.
              </p>
            </div>

            {/* Secure Payment Gateway Logos inside Summary */}
            <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-3">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <img
                src={resolveMediaUrl("/assets/payment_logo.png")}
                alt="Secure Payment Gateways - Cards, UPI, NetBanking, RuPay"
                className="h-8 sm:h-9 object-contain mx-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </aside>

          {/* RIGHT SIDE: CHECKOUT FORM (NO SCROLLBAR, CLEAN CARD) */}
          <form
            action={formAction}
            className="lg:col-span-7 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] order-1 lg:order-2"
            style={{ overflow: "visible", maxHeight: "none" }}
          >
            <div className="pb-5 mb-6 border-b border-neutral-100 dark:border-white/10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white m-0">
                Shipping Details
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Where should we send your renewal bottle?
              </p>
            </div>

            {/* Form Input Fields */}
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Michael Johnson"
                  className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 dark:border-white/20 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-900 dark:focus:border-white focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 dark:border-white/20 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-900 dark:focus:border-white focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 dark:border-white/20 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-900 dark:focus:border-white focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Complete Delivery Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  required
                  placeholder="House/Flat No., Building Name, Street, Area, Landmark, City & Pincode"
                  className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 dark:border-white/20 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-900 dark:focus:border-white focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 outline-none transition-all font-medium resize-none"
                />
              </div>
            </div>

            <input type="hidden" name="paymentMethod" value={paymentMethod} />
            <input type="hidden" name="cartJson" value={JSON.stringify(orderDraft.items)} />

            {/* MODERN PAYMENT SELECTION SECTION */}
            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/10">
              <div className="pb-4 mb-4">
                <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white m-0">
                  Select Payment Method
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Choose your preferred way to pay. Both methods are fully encrypted and secure.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {/* CARD 1: Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-start gap-4 ${
                    paymentMethod === "cod"
                      ? "border-neutral-900 bg-neutral-900/[0.04] dark:border-white dark:bg-white/[0.06] shadow-md"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 bg-white dark:bg-neutral-900"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      paymentMethod === "cod"
                        ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white text-white dark:text-neutral-900"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    {paymentMethod === "cod" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-extrabold text-base text-neutral-900 dark:text-white">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                        Zero Extra Charge
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                      Pay via Cash or UPI upon delivery.
                    </p>
                  </div>
                </div>

                {/* CARD 2: Razorpay (Instant Online Payment) */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-start gap-4 ${
                    paymentMethod === "razorpay"
                      ? "border-neutral-900 bg-neutral-900/[0.04] dark:border-white dark:bg-white/[0.06] shadow-md"
                      : "border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 bg-white dark:bg-neutral-900"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      paymentMethod === "razorpay"
                        ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white text-white dark:text-neutral-900"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    {paymentMethod === "razorpay" && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="font-extrabold text-base text-neutral-900 dark:text-white">
                          Razorpay (UPI, Cards & NetBanking)
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                        Instant Confirmation
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                      Instant online payment via UPI, Cards & NetBanking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message display if any */}
            {state.message ? (
              <div className="mt-5 p-4 rounded-xl bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800/60 font-semibold text-sm">
                {state.message}
              </div>
            ) : null}

            {/* SUBMIT BUTTON */}
            <div className="mt-8">
              <Button
                type="submit"
                disabled={pending}
                className="w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-neutral-900 via-neutral-800 to-black dark:from-white dark:via-neutral-100 dark:to-neutral-200 dark:text-neutral-950 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.45)] hover:opacity-95 transition-all flex items-center justify-center gap-2.5 text-base sm:text-xl transform active:scale-[0.99] h-auto"
              >
                <span>
                  {pending
                    ? "Processing Order..."
                    : `Place Order — ${money(total)} →`}
                </span>
              </Button>
            </div>

            {/* SECURE PAYMENT LOGOS FOOTER INSIDE FORM */}
            <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-3">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>100% Secure & Encrypted Payment Verification</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex flex-col items-center justify-center gap-2">
                <img
                  src={resolveMediaUrl("/assets/payment_logo.png")}
                  alt="Secure Payment Options - UPI, Cards, NetBanking"
                  className="h-8 sm:h-10 object-contain mx-auto"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 m-0 font-medium">
                  We accept all major credit/debit cards, UPI apps, and NetBanking safely via verified banking partners.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
