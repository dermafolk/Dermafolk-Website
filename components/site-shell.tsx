"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Home as HomeIcon, 
  ShoppingBag, 
  Sparkles, 
  Mail, 
  User, 
  Menu, 
  X, 
  ChevronRight,
  ShoppingCart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { NavAuth } from "@/components/nav-auth";
import { useCart } from "@/components/cart-provider";
import { subscribeNewsletterAction } from "@/app/contact/actions";
import { BackToTop } from "@/components/back-to-top";

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
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/about", label: "About", icon: Sparkles },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header className="sticky-header site-header">
      <div className="nav">

        <Link href="/" className="logo logo-image" aria-label="Dermafolk home">
          <BrandLogo className="brand-logo-navbar" />
        </Link>

        {/* Desktop Navigation Pill */}
        <nav className="desktop-nav-pill" aria-label="Main navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-item ${isActive ? "active" : ""}`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Navbar Actions */}
        <div className="nav-cta">
          <Link href="/cart" className="nav-cart-btn" aria-label="Shopping Cart">
            <ShoppingCart className="w-5 h-5" />
            {mounted && totalCount > 0 && (
              <span className="nav-cart-badge">{totalCount > 99 ? "99+" : totalCount}</span>
            )}
          </Link>

          <NavAuth />

          <Button asChild className="btn btn-primary desktop-buy-btn">
            <Link href="/shop#buy-panel" className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Now</span>
            </Link>
          </Button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Overlay Drawer */}
      <div
        className={`mobile-drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className="mobile-drawer-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-drawer-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`mobile-drawer-link ${isActive ? "active" : ""}`}
                >
                  <div className="mobile-drawer-link-left">
                    <span className="mobile-drawer-link-icon">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              );
            })}
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className={`mobile-drawer-link ${pathname === "/cart" ? "active" : ""}`}
            >
              <div className="mobile-drawer-link-left">
                <span className="mobile-drawer-link-icon">
                  <ShoppingCart className="w-5 h-5" />
                </span>
                <span>Shopping Cart</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {mounted && totalCount > 0 && (
                  <span style={{ background: "#E15B3D", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px" }}>
                    {totalCount} item{totalCount !== 1 ? "s" : ""}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 opacity-50" />
              </div>
            </Link>
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className={`mobile-drawer-link ${pathname === "/account" ? "active" : ""}`}
            >
              <div className="mobile-drawer-link-left">
                <span className="mobile-drawer-link-icon">
                  <User className="w-5 h-5" />
                </span>
                <span>My Account</span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-50" />
            </Link>
          </div>

          <div className="mobile-drawer-cta">
            <Button asChild className="btn btn-primary" style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Link href="/shop#buy-panel">
                <Sparkles className="w-5 h-5" />
                <span>Buy Renewal Face Wash</span>
              </Link>
            </Button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--ink-soft)", marginTop: "4px" }}>
              Made with recyclable glass • Small batches
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await subscribeNewsletterAction(email);
      setStatus(res);
      if (res.ok) {
        setEmail("");
      }
    } catch {
      setStatus({ ok: false, message: "Could not subscribe at this time." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <footer id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo logo-image footer-logo" aria-label="Dermafolk home">
              <BrandLogo className="brand-logo-footer" />
            </Link>
            <p style={{ color: "var(--ink-soft)", fontSize: "16px", maxWidth: "260px" }}>
              One renewal face wash, formulated to replace the routine - made in small batches and refillable for life.
            </p>
          </div>
         <div className="footer-sub">
           <div>
            <h5>Shop</h5>
            <ul>
              <li><Link href="/shop">Renewal Face Wash</Link></li>
              <li><Link href="/#formula">Refill Bottle</Link></li>
              <li><Link href="/contact">Gift Set</Link></li>
            </ul>
          </div>
          <div>
            <h5>Learn</h5>
            <ul>
              <li><Link href="/#formula">The Formula</Link></li>
              <li><Link href="/#ritual">The Ritual</Link></li>
              <li><Link href="/#reviews">Reviews</Link></li>
              <li><Link href="/contact">FAQ</Link></li>
            </ul>
          </div>
         </div>
          <div>
            <h5>Stay Updated</h5>
            <p style={{ color: "var(--ink-soft)", fontSize: "16px", marginBottom: "18px" }}>Restock alerts and formula notes, once a month.</p>
            <form onSubmit={handleSubscribe} className="footer-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                disabled={busy}
                required
              />
              <button type="submit" aria-label="Subscribe" disabled={busy}>
                {busy ? "..." : <MaterialIcon>arrow_forward</MaterialIcon>}
              </button>
            </form>
            {status ? (
              <p
                style={{
                  color: status.ok ? "#10b981" : "#ef4444",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginTop: "10px",
                }}
              >
                {status.ok ? "✓ " : ""}{status.message}
              </p>
            ) : null}
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

export function MobileBottomNav() {
  const pathname = usePathname();
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: totalCount },
    // { href: "/about", label: "About", icon: Sparkles },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile bottom navigation">
      <div className="mobile-bottom-nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-bottom-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.href === "/cart" && mounted && typeof item.badge === "number" && item.badge > 0 && (
                <span className="mobile-bottom-nav-badge">{item.badge > 99 ? "99+" : item.badge}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
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
      <MobileBottomNav />
      <BackToTop />
    </>
  );
}
