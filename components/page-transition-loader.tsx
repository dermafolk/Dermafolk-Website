"use client";

import { useEffect, useState, Suspense } from "react";
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
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setPrevPath(pathname);
      setLoading(false);
    }
  }, [pathname, searchParams, prevPath]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external links, anchor targets, download links, new tab clicks
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
        e.altKey
      ) {
        return;
      }

      // If it's navigating to a new internal pathname
      const cleanHref = href.split("?")[0]?.split("#")[0];
      if (cleanHref && cleanHref !== pathname && cleanHref.startsWith("/")) {
        // Delay loader so Next.js Link onClick triggers navigation first
        timeoutId = setTimeout(() => {
          setLoading(true);
        }, 50);
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: false });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: false });
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname]);

  // Fallback safety timeout so loader never gets stuck
  useEffect(() => {
    if (loading) {
      const fallback = setTimeout(() => {
        setLoading(false);
      }, 3500);
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
