"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * One delegated pointer listener for a whole group of cards. Writes --px/--py
 * (-1…1) onto the hovered [data-parallax] card; CSS turns them into transforms.
 * Fine pointers only; nothing runs on touch devices.
 */
export function ParallaxGroup({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let target: HTMLElement | null = null;
    let px = 0, py = 0;

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>("[data-parallax]");
      if (card !== target) {
        target?.style.setProperty("--px", "0");
        target?.style.setProperty("--py", "0");
        target = card;
      }
      if (!card) return;
      const r = card.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          target?.style.setProperty("--px", px.toFixed(3));
          target?.style.setProperty("--py", py.toFixed(3));
        });
    };
    const onLeave = () => {
      target?.style.setProperty("--px", "0");
      target?.style.setProperty("--py", "0");
      target = null;
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
