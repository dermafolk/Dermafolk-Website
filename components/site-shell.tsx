"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { NavAuth } from "@/components/nav-auth";

function MaterialIcon({ children }: { children: string }) {
  return <span className="msi">{children}</span>;
}

function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-logo ${className}`}>
      <img src="/assets/logo.png" alt="Dermafolk" />
    </span>
  );
}


export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header>
      <div className="nav">
        <a href="/" className="logo logo-image" aria-label="Dermafolk home">
          <BrandLogo className="brand-logo-navbar" />
        </a>
        <nav className="nav-links">
          <a href="/" className={pathname === "/" ? "active" : undefined}>Home</a>
          <a href="/shop" className={pathname === "/shop" ? "active" : undefined}>Shop</a>
          <a href="/about" className={pathname === "/about" ? "active" : undefined}>About</a>
          <a href="/contact" className={pathname === "/contact" ? "active" : undefined}>Contact</a>
        </nav>
        <div className="nav-cta">
          <NavAuth />
          <Button asChild className="btn btn-primary">
            <a href="/shop#buy-panel">Buy Now</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a href="/" className="logo logo-image footer-logo" aria-label="Dermafolk home">
              <BrandLogo className="brand-logo-footer" />
            </a>
            <p style={{ color: "var(--ink-soft)", fontSize: "16px", maxWidth: "260px" }}>
              One renewal face wash, formulated to replace the routine - made in small batches and refillable for life.
            </p>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li><a href="/shop">Renewal Face Wash</a></li>
              <li><a href="/#formula">Refill Bottle</a></li>
              <li><a href="/contact">Gift Set</a></li>
            </ul>
          </div>
          <div>
            <h5>Learn</h5>
            <ul>
              <li><a href="/#formula">The Formula</a></li>
              <li><a href="/#ritual">The Ritual</a></li>
              <li><a href="/#reviews">Reviews</a></li>
              <li><a href="/contact">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5>Stay Updated</h5>
            <p style={{ color: "var(--ink-soft)", fontSize: "16px", marginBottom: "18px" }}>Restock alerts and formula notes, once a month.</p>
            <div className="footer-form">
              <input type="email" placeholder="Email address" aria-label="Email address" />
              <button aria-label="Subscribe"><MaterialIcon>arrow_forward</MaterialIcon></button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>(c) 2026 Dermafolk Skincare. All rights reserved.</span>
          <span>Made with recyclable glass, always.</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
