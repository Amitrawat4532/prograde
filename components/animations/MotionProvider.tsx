"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToHash, setLenis } from "@/lib/scroll";

/**
 * Global motion runtime:
 *  - Lenis smooth scrolling (desktop pointers only, never with reduced motion)
 *  - one IntersectionObserver that drives every [data-reveal] element
 *  - in-page "/#section" links scroll smoothly instead of jumping
 */
export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    // Dev Strict Mode resets <html> attributes on remount; re-assert them.
    root.classList.add("js");
    root.dataset.hydrated = "1";

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---------- smooth scroll ---------- */
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    if (!reduced && fine) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    /* ---------- reveals ---------- */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const scan = (node: ParentNode) =>
      node.querySelectorAll?.("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan(document);
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-reveal]:not(.is-in)")) io.observe(n);
          scan(n);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    /* ---------- in-page anchors ---------- */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      if (scrollToHash(url.hash)) {
        e.preventDefault();
        history.replaceState(null, "", url.hash);
      }
    };
    document.addEventListener("click", onClick);

    // Land on a deep link like /#luts after layout settles
    if (location.hash) requestAnimationFrame(() => scrollToHash(location.hash));

    return () => {
      document.removeEventListener("click", onClick);
      mo.disconnect();
      io.disconnect();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
