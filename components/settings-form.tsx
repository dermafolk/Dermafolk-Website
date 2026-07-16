"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { Settings } from "@/lib/types";
import { saveSettingsAction } from "@/app/admin/actions";

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [state, formAction, pending] = useActionState(saveSettingsAction, {
    ok: false,
    message: "",
  });

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <section className="admin-stack">
      <div className="admin-card">
        <h2>Shipping and Payment Settings</h2>
        <p>COD, shipping charge and Razorpay online payments.</p>
      </div>

      <div className="admin-card">
        <form action={formAction} className="admin-stack">
          <div className="field">
            <label>Shipping charge (₹)</label>
            <input
              name="shippingCharge"
              type="number"
              min={0}
              step={1}
              defaultValue={settings.shippingCharge}
              placeholder="0"
              required
            />
          </div>

          <label className="admin-check">
            <input type="checkbox" name="codEnabled" defaultChecked={settings.codEnabled} />
            <span>Cash on Delivery (COD) enabled</span>
          </label>

          <label className="admin-check">
            <input
              type="checkbox"
              name="razorpayEnabled"
              defaultChecked={settings.razorpayEnabled}
            />
            <span>Razorpay enabled</span>
          </label>

          <div className="field">
            <label>Razorpay Key ID</label>
            <input
              name="razorpayKeyId"
              type="text"
              defaultValue={settings.razorpayKeyId}
              placeholder="rzp_live_..."
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label>Razorpay Key Secret</label>
            <input
              name="razorpayKeySecret"
              type="password"
              defaultValue=""
              placeholder={settings.razorpayKeySecretConfigured ? "•••••••••••• (saved — leave blank to keep)" : "Paste your Razorpay key secret"}
              autoComplete="off"
            />
            <p className="desc" style={{ marginTop: "6px" }}>
              {settings.razorpayKeySecretConfigured
                ? "A key secret is currently saved. It's never shown here or sent to the browser — leave this blank to keep it unchanged, or paste a new one to replace it."
                : "No key secret saved yet. This value stays server-side only and is never exposed to customers."}
            </p>
          </div>

          <div className="field">
            <label>Razorpay Webhook Secret</label>
            <input
              name="razorpayWebhookSecret"
              type="password"
              defaultValue=""
              placeholder={settings.razorpayWebhookSecretConfigured ? "•••••••••••• (saved — leave blank to keep)" : "Paste the webhook secret you set in Razorpay"}
              autoComplete="off"
            />
            <p className="desc" style={{ marginTop: "6px" }}>
              In your{" "}
              <a href="https://dashboard.razorpay.com/app/webhooks" target="_blank" rel="noreferrer">
                Razorpay Dashboard → Webhooks
              </a>
              , add a webhook with URL{" "}
              <code style={{ userSelect: "all" }}>{origin || "https://your-domain.com"}/api/webhooks/razorpay</code>,
              enable the <strong>payment.captured</strong> event, set your own secret there, then paste that same
              secret here. This lets Razorpay confirm a payment even if the customer&apos;s browser closes before
              checkout finishes.
            </p>
          </div>

          {state.message ? (
            <p className="desc" style={{ color: state.ok ? "#1a7f37" : "#b3261e" }}>
              {state.message}
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>Save settings</span>
          </button>
        </form>
      </div>
    </section>
  );
}
