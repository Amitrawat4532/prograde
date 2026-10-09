"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/** Lays a panel back in 3D and brings it upright as it scrolls into view. */
export function ScrollTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current,
        { rotateX: 28, scale: 0.88, yPercent: 6 },
        {
          rotateX: 0,
          scale: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center 55%", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <div className={`[perspective:1600px] ${className}`}>
      <div ref={ref} className="origin-bottom will-change-transform">
        {children}
      </div>
    </div>
  );
}
