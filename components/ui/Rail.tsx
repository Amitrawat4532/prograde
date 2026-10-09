"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Native horizontal swipe rail: scroll-snap, the next card peeks in, a live
 * counter, and arrow buttons on desktop. No scroll hijacking.
 */
export function Rail({
  children,
  count,
  label,
  className = "",
  desktopGrid,
}: {
  children: ReactNode;
  count: number;
  label: string;
  className?: string;
  /** e.g. "lg:grid-cols-4" — turns the rail into a static grid from lg up */
  desktopGrid?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const first = el.firstElementChild as HTMLElement | null;
      const step = first ? first.offsetWidth : el.clientWidth;
      const i = Math.round(el.scrollLeft / Math.max(step, 1));
      setIndex(Math.min(count - 1, i));
      setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  const go = (dir: 1 | -1) => {
    const el = ref.current!;
    const first = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * (first ? first.offsetWidth : el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className={className}>
      <ul
        ref={ref}
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] overflow-x-auto overscroll-x-contain px-[var(--gutter)] [&>li]:snap-start ${desktopGrid ? `lg:mx-0 lg:grid lg:gap-6 lg:overflow-visible lg:px-0 ${desktopGrid}` : ""}`}
      >
        {children}
      </ul>
      <div className={`mt-5 flex items-center justify-between gap-4 ${desktopGrid ? "lg:hidden" : ""}`}>
        <div className="flex flex-1 items-center gap-3" aria-hidden>
          <span className="meta text-ink">{String(index + 1).padStart(2, "0")}</span>
          <span className="relative h-px flex-1 bg-line">
            <span
              className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-500"
              style={{ width: `${((index + 1) / count) * 100}%` }}
            />
          </span>
          <span className="meta text-muted">{String(count).padStart(2, "0")}</span>
        </div>
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => go(-1)} disabled={edges.start} className="btn h-11! px-4! disabled:opacity-30" aria-label="Previous">
            ←
          </button>
          <button type="button" onClick={() => go(1)} disabled={edges.end} className="btn h-11! px-4! disabled:opacity-30" aria-label="Next">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
