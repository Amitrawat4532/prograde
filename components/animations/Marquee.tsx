"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "@/lib/hooks";

/** CSS-only marquee (transform animation on the compositor), paused off-screen. */
export function Marquee({ children, duration = 40, className = "" }: { children: ReactNode; duration?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "100px");
  return (
    <div ref={ref} data-paused={!inView} className={`overflow-hidden ${className}`}>
      <div className="marquee" style={{ "--dur": `${duration}s` } as CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
