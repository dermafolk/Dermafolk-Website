import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "About Us | Dermafolk - Simple Skincare. Visible Results.",
  description:
    "Learn about Dermafolk and our philosophy of simple, effective, clean skincare built for your everyday routine.",
};

function MaterialIcon({ children }: { children: string }) {
  return <span className="msi">{children}</span>;
}

const features = [
  {
    icon: "eco",
    title: "Clean Ingredients",
    desc: "Carefully chosen actives including Glutathione & Niacinamide for visible skin benefits.",
  },
  {
    icon: "sanitizer",
    title: "Effective Formulas",
    desc: "Backed by science and dermatologist testing, made specifically for real daily results.",
  },
  {
    icon: "water_drop",
    title: "Gentle & Safe",
    desc: "Fragrance-free and pH balanced, suitable for all skin types including sensitive skin.",
  },
  {
    icon: "favorite",
    title: "Made With Care",
    desc: "100% vegan, cruelty-free, and packaged thoughtfully in refillable glass bottles.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      {/* Section 1 — About Hero Section */}
      <section className="about-hero-section">
        <div className="about-container">
          <div className="about-hero-split">
            <div className="about-hero-text-col">
              <div className="about-badge-pill">
                <MaterialIcon>auto_awesome</MaterialIcon>
                <span>OUR PHILOSOPHY</span>
              </div>
              <h2 className="about-h1">Simple skincare.<br />Visible results.</h2>
              <p className="about-tagline">
                Less clutter. More clarity. Better skin every single day.
              </p>
              <div className="about-text-body">
                <p>
                  Dermafolk was created for people who want fewer products on their bathroom counter, not more complicated routines. We believe skincare should be effective, honest, and easy to understand.
                </p>
                <p>
                  Our renewal face wash formula stays strictly focused on a single job: make daily cleansing, gentle resurfacing, and brightening simpler without compromising on potency.
                </p>
                <p>
                  Every drop is formulated with transparent concentrations of high-grade actives so you always know exactly what is nurturing your skin.
                </p>
              </div>
            </div>
            <div className="about-hero-image-col">
              <div className="about-hero-image-frame">
                <img
                  src="/assets/banner-image.webp"
                  alt="Dermafolk Face Wash bottle with natural botanical styling"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Why We Built Dermafolk */}
      <section className="about-features-section">
        <div className="about-container">
          <div className="about-section-header">
            <div className="about-badge-pill">
              <MaterialIcon>verified</MaterialIcon>
              <span>CORE VALUES</span>
            </div>
            <h2 className="about-section-h2">Why We Built Dermafolk</h2>
            <p className="about-section-desc">
              We stripped away unnecessary fillers, harsh fragrances, and confusing 10-step rituals to bring you skincare principles you can trust.
            </p>
          </div>

          <div className="about-features-grid">
            {features.map((f) => (
              <div className="about-feature-card" key={f.title}>
                <div className="about-feature-icon-badge">
                  <MaterialIcon>{f.icon}</MaterialIcon>
                </div>
                <h3 className="about-feature-title">{f.title}</h3>
                <p className="about-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Our Promise Banner */}
      <section className="about-promise-section">
        <div className="about-container">
          <div className="about-promise-card">
            <div className="about-promise-image-box">
              <img
                src="/assets/lower_left_image.webp"
                alt="Dermafolk skincare texture and botanical ingredients"
              />
            </div>
            <div className="about-promise-content-box">
              <div className="about-badge-pill">
                <MaterialIcon>handshake</MaterialIcon>
                <span>OUR PROMISE</span>
              </div>
              <h2 className="about-promise-h2">Skincare that fits into your real life.</h2>
              <p className="about-promise-text">
                We keep our promise simple: High-quality ingredients, transparent formulas, and a better everyday ritual for your skin. No miracles—just consistent, dermatologically sound renewal.
              </p>
              <div className="about-promise-quote-box">
                <MaterialIcon>format_quote</MaterialIcon>
                <p>
                  &ldquo;When your skincare routine is simple and enjoyable, consistency follows naturally—and consistency is the secret to healthy skin.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
