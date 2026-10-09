"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { lutPacks } from "@/lib/content";
import { useInView, useTier } from "@/lib/hooks";
import { lutSelection } from "@/lib/lutSelection";

const ColorCube = dynamic(() => import("@/components/3d/ColorCube"), { ssr: false });

/** The 3D LUT cube + caption. Skipped without WebGL / with reduced motion. */
export function LutCube({ className = "" }: { className?: string }) {
  const tier = useTier();
  if (tier === "off") return null;
  return <CubeFigure lite={tier === "lite"} className={className} />;
}

/** Separate component so its ref exists on first mount (the in-view observers depend on it). */
function CubeFigure({ lite, className }: { lite: boolean; className: string }) {
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, "50% 0px", true); // mount the canvas half a screen early
  const active = useInView(ref, "0px"); // render only while visible
  const [pack, setPack] = useState(lutSelection.get());
  useEffect(() => lutSelection.subscribe(setPack), []);

  return (
    <figure ref={ref} className={`relative ${className}`}>
      <div className="absolute inset-0 bottom-6" data-cursor="drag">
        {near && <ColorCube lite={lite} active={active} />}
      </div>
      <figcaption className="meta pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 text-[0.6rem]! text-muted">
        <span>
          3D LUT — <span className="text-amber">{lutPacks[pack].name}</span>
        </span>
        <span>{lite ? "1,331" : "4,913"} colours</span>
      </figcaption>
    </figure>
  );
}
