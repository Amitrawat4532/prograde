"use client";

import Link from "next/link";
import { useState } from "react";
import { lutPacks } from "@/lib/content";
import { formatPrice } from "@/lib/site";
import { BeforeAfter } from "./BeforeAfter";
import { BuyButton } from "./BuyButton";

/** The featured comparator: pick a pack, drag the split, buy without scrolling. */
export function LutShowcase() {
  const [i, setI] = useState(0);
  const pack = lutPacks[i];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
      <div className="min-w-0">
        {/* Taller frame on phones so the comparison is readable; scope ratio on desktop */}
        <BeforeAfter
          key={pack.slug}
          image={pack.image}
          grade={pack.grade}
          gradeName={pack.name}
          ratio={2.39}
          mobileRatio={4 / 5}
          sizes="(min-width: 1024px) 70vw, 100vw"
          mode="drag"
          className="frame-marks -mx-[var(--gutter)] sm:mx-0"
        />
        <div role="tablist" aria-label="LUT packs" className="no-scrollbar -mx-[var(--gutter)] mt-3 flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
          {lutPacks.map((p, idx) => (
            <button
              key={p.slug}
              role="tab"
              aria-selected={idx === i}
              onClick={() => setI(idx)}
              className="meta flex h-11 shrink-0 items-center gap-2.5 border border-line px-3.5 text-ink-2 transition-colors hover:text-ink aria-selected:border-ink aria-selected:text-ink"
            >
              <span aria-hidden className="flex">
                {p.swatch.map((c) => (
                  <span key={c} className="h-3 w-2.5" style={{ background: c }} />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 lg:border-l lg:border-line lg:pl-10">
        <div>
          <p className="meta text-amber">{pack.count} LUTs — .cube · LOG + Rec.709</p>
          <h3 className="mt-3 text-[clamp(2rem,3.4vw,3.2rem)] font-semibold uppercase leading-[0.95] tracking-[-0.035em]">{pack.name}</h3>
          <p className="serif mt-2 text-xl italic text-ink-2">{pack.subtitle}</p>
          <p className="mt-4 hidden text-sm leading-relaxed text-ink-2 sm:block">{pack.description}</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-5 lg:flex-col lg:items-start">
          <p className="flex items-baseline gap-2.5">
            <span className="text-3xl font-semibold tracking-[-0.02em]">{formatPrice(pack.price)}</span>
            {pack.compareAt && (
              <s className="meta text-muted" aria-label={`was ${formatPrice(pack.compareAt)}`}>
                {formatPrice(pack.compareAt)}
              </s>
            )}
          </p>
          <div className="flex gap-2">
            <BuyButton item={`Prograde ${pack.name} LUT pack`} price={pack.price} checkoutUrl={pack.checkoutUrl} label="Buy" className="btn btn-amber px-5!" />
            <Link href={`/luts/${pack.slug}`} className="btn hidden! px-5! sm:inline-flex!" data-cursor="View">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
