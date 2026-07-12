"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Circumference of radius 21 = 2 * Math.PI * 21 ≈ 131.95
  const circumference = 131.95;
  const strokeDashoffset = circumference - (circumference * scrollProgress) / 100;

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top-button ${visible ? "is-visible" : ""}`}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg className="back-to-top-ring" width="52" height="52" viewBox="0 0 52 52">
        <circle
          className="back-to-top-ring-bg"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="3"
          fill="transparent"
          r="21"
          cx="26"
          cy="26"
        />
        <circle
          className="back-to-top-ring-progress"
          stroke="var(--sand, #E4CFA6)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="transparent"
          r="21"
          cx="26"
          cy="26"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset,
          }}
        />
      </svg>
      <div className="back-to-top-inner">
        <ArrowUp className="back-to-top-icon w-5 h-5" />
      </div>
    </button>
  );
}
