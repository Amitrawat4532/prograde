"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Thumb-reach actions on phones. Appears after the hero; hides while the LUT
 * store, collaboration, contact section or footer is on screen so it never covers their CTAs.
 */
export function MobileDock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const blockers = ["#lens", "#luts", "#build", "#contact", "footer"].map((s) => document.querySelector(s)).filter(Boolean) as Element[];
    const blocked = new Set<Element>();
    let pastHero = false;
    const update = () => setShow(pastHero && blocked.size === 0);

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) blocked.add(e.target);
        else blocked.delete(e.target);
      }
      update();
    });
    blockers.forEach((b) => io.observe(b));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > window.innerHeight * 0.85;
        if (next !== pastHero) {
          pastHero = next;
          update();
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-2 gap-2 border border-line-strong bg-black/90 p-2 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] lg:hidden ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"}`}
    >
      <Link href="/#contact" className="btn h-11! justify-center px-2!">
        Book a shoot
      </Link>
      <Link href="/#luts" className="btn btn-amber h-11! justify-center px-2!">
        Shop LUTs −50%
      </Link>
    </div>
  );
}
