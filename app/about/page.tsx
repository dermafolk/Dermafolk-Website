import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "About - Dermafolk",
  description: "About Dermafolk and the renewal serum philosophy.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="section-pad">
        <div className="wrap split-grid">
          <div className="text-col">
            <div className="inner">
              <div className="kicker">About</div>
              <h1 style={{ fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.05, marginBottom: "18px" }}>
                One serum. Built to replace the shelf.
              </h1>
              <p className="desc">
                Dermafolk was created for people who want fewer products, not more boxes. The formula and the site both
                stay focused on a single job: make daily skincare simpler without making it weaker.
              </p>
              <p className="desc">
                The brand is structured to scale into a future catalog, but the current experience stays honest to the
                original single-product launch.
              </p>
            </div>
          </div>
          <div className="img-col">
            <img src="/assets/banner-image.webp" alt="Dermafolk product bottle styled with plant shadows and aloe vera" />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
