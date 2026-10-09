"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "@/lib/hooks";

/** Sets data-paused on itself so CSS animations inside stop when off-screen. */
export function PauseOffscreen({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "50px");
  return (
    <div ref={ref} data-paused={!inView} className={className}>
      {children}
    </div>
  );
}
