"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop-only cursor. One element, transform-only, and the rAF loop sleeps
 * as soon as the cursor settles. Labels come from the nearest [data-cursor].
 *   data-cursor="View" | "Explore" | "Buy" | any short label
 *   data-cursor="drag" shows ⟷ for sliders
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    const el = ref.current!;
    const labelEl = labelRef.current!;
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, cx = -100, cy = -100;
    let scale = 1, targetScale = 1;
    let raf = 0;
    let visible = false;

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      scale += (targetScale - scale) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${scale})`;
      const settled = Math.abs(x - cx) < 0.1 && Math.abs(y - cy) < 0.1 && Math.abs(targetScale - scale) < 0.001;
      raf = settled ? 0 : requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x;
        cy = y;
        el.style.opacity = "1";
      }
      wake();
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element;
      const host = t.closest?.("[data-cursor]");
      const interactive = t.closest?.("a, button, [role='button'], label, summary");
      const label = host?.getAttribute("data-cursor") ?? "";
      if (label) {
        labelEl.textContent = label === "drag" ? "⟷" : label;
        el.dataset.state = "label";
        targetScale = 1;
      } else if (interactive) {
        labelEl.textContent = "";
        el.dataset.state = "link";
        targetScale = 1;
      } else {
        labelEl.textContent = "";
        el.dataset.state = "dot";
        targetScale = 1;
      }
      wake();
    };
    const onDown = () => {
      targetScale = 0.8;
      wake();
    };
    const onUp = () => {
      targetScale = 1;
      wake();
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-state="dot"
      className="cursor pointer-events-none fixed left-0 top-0 z-[70] opacity-0 transition-opacity duration-300"
    >
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
