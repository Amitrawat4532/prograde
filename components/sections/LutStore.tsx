import Link from "next/link";
import { lutBundle, lutPacks } from "@/lib/content";
import { formatPrice } from "@/lib/site";
import { RevealText } from "@/components/animations/RevealText";
import { BeforeAfter } from "@/components/products/BeforeAfter";
import { BuyButton } from "@/components/products/BuyButton";
import { LutShowcase } from "@/components/products/LutShowcase";
import { Rail } from "@/components/ui/Rail";

export function LutStore() {
  return (
    <section
      id="luts"
      aria-labelledby="luts-title"
      className="relative bg-[linear-gradient(180deg,#140d07_0%,#090706_14%,#050505_40%)] px-[var(--gutter)] py-20 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-8 grid gap-5 md:mb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5" data-reveal="fade">
              03 — Prograde LUTs
            </p>
            <RevealText
              id="luts-title"
              lines={[
                "Color,",
                <span key="w">
                  without <span className="serif italic normal-case tracking-normal text-amber">compromise.</span>
                </span>,
              ]}
              className="display text-[clamp(2.9rem,12.5vw,9rem)]"
            />
          </div>
          <div data-reveal="fade" className="flex flex-col gap-4 lg:col-span-4">
            <p className="meta inline-flex w-fit items-center gap-2 border border-amber/50 px-3 py-2 text-amber">
              <span className="rec bg-amber!" aria-hidden /> Launch offer — 50% off
            </p>
            <p className="text-[0.95rem] leading-relaxed text-ink-2">
              The looks from his own films. Drag the slider — left is LOG, right is graded.
            </p>
          </div>
        </header>

        <LutShowcase />

        {/* All packs — swipe on phones and tablets, a row of four on desktop */}
        <div className="mt-16 md:mt-24">
          <h3 className="eyebrow mb-6">All packs</h3>
          <Rail count={lutPacks.length} label="LUT packs" desktopGrid="lg:grid-cols-4">
            {lutPacks.map((p, i) => (
              <li key={p.slug} className="w-[72%] shrink-0 pr-3 sm:w-[42%] lg:w-auto lg:pr-0">
                <BeforeAfter image={p.image} grade={p.grade} gradeName={p.name} ratio={4 / 5} sizes="(min-width: 1024px) 24vw, 72vw" mode="hover" />
                <p className="meta mt-4 text-muted">
                  {String(i + 1).padStart(2, "0")} — {p.count} LUTs
                </p>
                <h4 className="mt-1.5 text-xl font-semibold uppercase leading-none tracking-[-0.02em]">
                  <Link href={`/luts/${p.slug}`} className="link-u">
                    {p.name}
                  </Link>
                </h4>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="font-semibold">{formatPrice(p.price)}</span>
                  {p.compareAt && <s className="meta text-muted">{formatPrice(p.compareAt)}</s>}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <BuyButton item={`Prograde ${p.name} LUT pack`} price={p.price} checkoutUrl={p.checkoutUrl} label="Buy" className="btn btn-solid h-11! justify-center px-3!" />
                  <Link href={`/luts/${p.slug}`} className="btn h-11! justify-center px-3!" data-cursor="View">
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </Rail>
        </div>

        {/* Bundle */}
        <div
          data-reveal="clip"
          className="mt-14 grid items-center gap-6 border border-amber/40 bg-[radial-gradient(ellipse_at_0%_0%,rgb(217_164_91/0.14),transparent_60%)] p-6 md:mt-20 md:grid-cols-[1fr_auto] md:p-10"
        >
          <div>
            <p className="meta text-amber">Bundle — {lutBundle.count} LUTs</p>
            <h3 className="mt-2 text-[clamp(1.6rem,3.5vw,3rem)] font-semibold uppercase leading-none tracking-[-0.03em]">{lutBundle.name}</h3>
            <p className="mt-2 text-ink-2">
              Every pack + future updates.{" "}
              <span className="text-ink">
                {formatPrice(lutBundle.price)} <s className="text-muted">{formatPrice(lutBundle.compareAt)}</s>
              </span>
            </p>
          </div>
          <BuyButton item={lutBundle.name} price={lutBundle.price} checkoutUrl={lutBundle.checkoutUrl} label="Buy the bundle" className="btn btn-amber justify-center" />
        </div>

        <p className="meta mt-8 leading-loose text-muted">
          <span className="text-ink-2">Works in</span> DaVinci Resolve · Premiere Pro · Final Cut Pro · CapCut · LumaFusion — LOG & Rec.709
          versions · Install guide included
        </p>
      </div>
    </section>
  );
}
