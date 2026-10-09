"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type RefObject } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

/** SSR-safe media query. Returns `false` on the server and first paint. */
export function useMedia(query: string) {
  const subscribe = useMemo(() => subscribeMedia(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
/** Large screen + mouse: gets the full visual experience. */
const useIsDesktop = () => useMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");

const noopSubscribe = () => () => {};

let webglSupport: boolean | null = null;
export function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/** 3D tier: "full" on desktop, "lite" on tablets/phones, "off" without WebGL or with reduced motion. */
export type Tier = "full" | "lite" | "off";
export function useTier(): Tier {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const gl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  if (!gl || reduced) return "off";
  return desktop ? "full" : "lite";
}

/** True while the element is within `margin` of the viewport. */
export function useInView<T extends Element>(ref: RefObject<T | null>, margin = "0px", once = false) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, once]);
  return inView;
}
