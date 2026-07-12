import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "About - Dermafolk",
  description: "About Dermafolk and the renewal face wash philosophy.",
};

function MaterialIcon({ children }: { children: string }) {
  return <span className="msi">{children}</span>;
}

const features = [
  {
    icon: "eco",
    title: "CLEAN INGREDIENTS",
    desc: "Carefully chosen actives for real skin benefits.",
  },
  {
    icon: "sanitizer",
    title: "EFFECTIVE FORMULAS",
    desc: "Backed by research, made for visible results.",
  },
  {
    icon: "water_drop",
    title: "GENTLE & SAFE",
    desc: "Suitable for all skin types, including sensitive skin.",
  },
  {
    icon: "favorite",
    title: "MADE WITH CARE",
    desc: "Thoughtful processes you can trust, always.",
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      {/* Section 1 — About Hero */}
      <section className="about-hero">
        <div className="about-hero-container wrap">
          <div className="about-hero-grid">
            <div className="about-hero-content">
              <div className="about-eyebrow">ABOUT US</div>
              <h1 className="about-heading">About Dermafolk</h1>
              <p className="about-subtitle">Simple skincare. Visible results.</p>
              <div className="about-body">
                <p>
                  Dermafolk was created for people who want fewer products, not more boxes.
                  We believe skincare should be effective, honest, and easy to understand.
                </p>
                <p>
                  Our formula and the site both stay focused on a single job: make daily skincare simpler without making it weaker.
                </p>
                <p>
                  The brand is structured to scale into a future catalog, but the current experience stays honest to the original single-product launch.
                </p>
              </div>
            </div>
            <div className="about-hero-image">
              <img src="/assets/banner-image.webp" alt="Dermafolk product bottle styled with plant shadows and aloe vera" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Features */}
      <section className="about-features">
        <div className="about-features-container wrap">
          <div className="about-features-grid">
            {features.map((f) => (
              <div className="about-feature-card" key={f.title}>
                <span className="about-feature-icon" aria-hidden="true">
                  <MaterialIcon>{f.icon}</MaterialIcon>
                </span>
                <h3 className="about-feature-title">{f.title}</h3>
                <p className="about-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Our Promise */}
      <section className="about-promise">
        <div className="about-promise-container wrap">
          <div className="about-promise-grid">
            <div className="about-promise-image">
              <img src="/assets/lower_left_image.png" alt="Dermafolk product photography" />
            </div>
            <div className="about-promise-content">
              <div className="about-eyebrow">OUR PROMISE</div>
              <h2 className="about-promise-heading">Skincare that fits real life.</h2>
              <p className="about-promise-text">
                We keep our promise simple: High-quality ingredients, transparent formulas, and a better everyday for your skin.
              </p>
              <p className="about-promise-highlight">Less clutter. More clarity. Better skin.</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
