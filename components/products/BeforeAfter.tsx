"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { applyGrade, type Grade } from "@/lib/grading";
import type { Still } from "@/lib/content";
import { useInView } from "@/lib/hooks";

type Props = {
  image: Still;
  grade: Grade;
  gradeName: string;
  /** width / height */
  ratio?: number;
  /** optional taller ratio below 640px */
  mobileRatio?: number;
  sizes: string;
  /** "hover": follows the pointer on desktop (cards). "drag": explicit handle (featured). */
  mode?: "hover" | "drag";
  className?: string;
  preload?: boolean;
};

// Flat LOG look for the BEFORE side — a static CSS filter, rasterised once.
const LOG_FILTER = "saturate(0.5) contrast(0.68) brightness(1.1) sepia(0.06)";

/**
 * LEFT: original LOG-style footage. RIGHT: the pack's grade, computed once on
 * a canvas from the real pixels. Moving the split only changes a clip-path.
 */
export function BeforeAfter({ image, grade, gradeName, ratio = 16 / 9, mobileRatio, sizes, mode = "drag", className = "", preload }: Props) {
  const pos50 = `${image.focus ?? 50}% 50%`;
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState(50);
  const pos = useRef({ cur: 50, target: 50, raf: 0 });
  const inView = useInView(wrap, "300px", true);

  /* ---------- grade once, when near the viewport ---------- */
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    // Grade at the frame's own ratio; CSS object-fit crops both layers identically.
    const { props } = getImageProps({ src: image.src, alt: "", width: 640, height: 360, quality: 70 });
    const img = new window.Image();
    img.decoding = "async";
    img.src = props.src;
    img
      .decode()
      .then(() => {
        if (cancelled || !canvas.current) return;
        const c = canvas.current;
        const W = Math.min(1280, img.naturalWidth);
        const H = Math.round((W / img.naturalWidth) * img.naturalHeight);
        c.width = W;
        c.height = H;
        const ctx = c.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, W, H);
        const graded = applyGrade(ctx.getImageData(0, 0, W, H), grade);
        ctx.putImageData(graded, 0, 0);
        setReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [inView, image.src, grade]);

  /* ---------- smooth split ---------- */
  const setTarget = (v: number) => {
    const p = pos.current;
    p.target = Math.max(0, Math.min(100, v));
    if (p.raf) return;
    const step = () => {
      p.cur += (p.target - p.cur) * 0.2;
      if (Math.abs(p.target - p.cur) < 0.05) p.cur = p.target;
      wrap.current?.style.setProperty("--pos", p.cur.toFixed(2));
      p.raf = p.cur === p.target ? 0 : requestAnimationFrame(step);
    };
    p.raf = requestAnimationFrame(step);
  };

  useEffect(() => {
    const p = pos.current;
    return () => cancelAnimationFrame(p.raf);
  }, []);

  const onHoverMove = (e: React.PointerEvent) => {
    if (mode !== "hover" || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setTarget(((e.clientX - r.left) / r.width) * 100);
  };

  return (
    <div
      ref={wrap}
      className={`group/ba relative aspect-[var(--ar-m)] select-none overflow-hidden bg-panel [container-type:inline-size] sm:aspect-[var(--ar)] ${className}`}
      style={{ "--ar": String(ratio), "--ar-m": String(mobileRatio ?? ratio), "--pos": 50 } as CSSProperties}
      onPointerMove={onHoverMove}
      onPointerLeave={() => mode === "hover" && setTarget(50)}
      data-cursor={mode === "drag" ? "drag" : undefined}
    >
      {/* BEFORE */}
      <Image
        src={image.src}
        alt={`${image.alt} — before grading`}
        fill
        sizes={sizes}
        quality={70}
        preload={preload}
        className="object-cover"
        style={{ filter: LOG_FILTER, objectPosition: pos50 }}
      />

      {/* AFTER */}
      <div className="absolute inset-0 [clip-path:inset(0_0_0_calc(var(--pos)*1%))]">
        <Image src={image.src} alt="" fill sizes={sizes} quality={70} className="object-cover" style={{ objectPosition: pos50 }} aria-hidden />
        <canvas
          ref={canvas}
          aria-label={`${image.alt} — graded with ${gradeName}`}
          role="img"
          style={{ objectPosition: pos50 }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* split line + handle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-ink/80 [transform:translate3d(calc(var(--pos)*1cqw),0,0)]"
      >
        <div
          className={`absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/70 bg-black/40 text-[0.7rem] text-ink transition-opacity ${mode === "hover" ? "opacity-0 group-hover/ba:opacity-100" : ""}`}
        >
          ⟷
        </div>
      </div>

      <span className="meta pointer-events-none absolute left-4 top-4 bg-black/50 px-2 py-1 text-[0.6rem]! text-ink-2">Log</span>
      <span className="meta pointer-events-none absolute right-4 top-4 bg-black/50 px-2 py-1 text-[0.6rem]! text-ink">
        {gradeName}
      </span>

      {/* Native range input: keyboard, touch and screen-reader support for free */}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          setValue(v);
          setTarget(v);
        }}
        aria-label={`Compare original and ${gradeName} grade`}
        aria-valuetext={`${value}% original`}
        className={`absolute inset-0 h-full w-full cursor-ew-resize opacity-0 [touch-action:pan-y] ${mode === "hover" ? "pointer-events-none [@media(hover:none)]:pointer-events-auto" : ""}`}
      />
    </div>
  );
}
