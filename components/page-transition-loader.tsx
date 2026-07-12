"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function CircleLogoLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="page-loader-overlay" role="status" aria-label="Loading page">
      <div className="circle-loader-container">
        <div className="circle-loader-ring"></div>
        <div className="circle-loader-ring-glow"></div>
        <div className="circle-loader-logo-wrap">
          <img
            src="/assets/logo-icon.png"
            alt="Dermafolk Logo Icon"
            className="circle-loader-logo"
          />
        </div>
      </div>
      {text && <p className="circle-loader-text">{text}</p>}
    </div>
  );
}

function PageTransitionHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        anchor.hasAttribute("data-no-loader")
      ) {
        return;
      }

      const cleanHref = href.split("?")[0]?.split("#")[0];
      if (cleanHref && cleanHref !== pathname && cleanHref.startsWith("/")) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const startPath = pathname;
        timeoutRef.current = setTimeout(() => {
          if (window.location.pathname === startPath) {
            setLoading(true);
          }
        }, 150);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: false });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: false });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  // Fallback safety timeout so loader never gets stuck
  useEffect(() => {
    if (loading) {
      const fallback = setTimeout(() => {
        setLoading(false);
      }, 800);
      return () => clearTimeout(fallback);
    }
  }, [loading]);

  if (!loading) return null;

  return <CircleLogoLoader text="Loading..." />;
}

export function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionHandler />
    </Suspense>
  );
}
