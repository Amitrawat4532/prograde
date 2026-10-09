"use client";

import type Lenis from "lenis";

/** Module-level handle to the smooth scroller (null on touch / reduced motion). */
let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}
