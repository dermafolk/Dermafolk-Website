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
      <section className="contact-page section-pad">
        <div className="wrap">
          <div className="contact-card">
            <div className="contact-card-left">
              <div className="contact-glow" aria-hidden="true" />
              <div className="contact-left-inner">
                <h2 className="contact-heading">Get in Touch</h2>
                <p className="contact-lede">
                  We&apos;d love to hear from you. Whether it&apos;s a question about sizing or a custom order, we&apos;re here to help.
                </p>

                <div className="contact-info-block">
                  <span className="contact-icon-ring" aria-hidden="true">
                    <span className="msi">mail</span>
                  </span>
                  <div>
                    <div className="contact-info-label">Email Us</div>
                    <a className="contact-info-value" href="mailto:dermafolk1@gmail.com">
                      dermafolk1@gmail.com
                    </a>
                  </div>
                </div>

                <div className="contact-info-block">
                  <span className="contact-icon-ring" aria-hidden="true">
                    <span className="msi">call</span>
                  </span>
                  <div>
                    <div className="contact-info-label">WhatsApp / Call</div>
                    <a className="contact-info-value" href="tel:+918446082893">
                      +918446082893
                    </a>
                  </div>
                </div>

                <div className="contact-divider" />

                <div className="contact-location-section">
                  <div className="contact-info-label">Studio Location</div>
                  <div className="contact-location-text">Nanded, MH, India</div>
                </div>
              </div>
            </div>

            <div className="contact-card-right">
              <div className="contact-right-inner">
                <h2 className="contact-form-title">Send a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}