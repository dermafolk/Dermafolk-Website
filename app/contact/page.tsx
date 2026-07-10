import type { Metadata } from "next";

import { ContactForm } from "./contact-form";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Contact - Dermafolk",
  description: "Contact Dermafolk for product, order, and support enquiries.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="section-pad">
        <div className="wrap">
          <div className="kicker">Contact</div>
          <h1 style={{ fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.05, marginBottom: "18px", maxWidth: "720px" }}>
            Reach out about the serum, support, or future orders.
          </h1>
          <div className="split-grid" style={{ marginTop: "46px" }}>
            <div className="text-col">
              <div className="inner">
                <p className="desc">Use this form for customer support, order questions, wholesale enquiries, or general feedback.</p>
                <p className="desc">Messages submit through Supabase when credentials are available, with a local fallback for development.</p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
