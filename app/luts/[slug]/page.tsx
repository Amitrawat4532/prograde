import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLutPack, lutBundle, lutInstallSteps, lutPacks } from "@/lib/content";
import { formatPrice, site } from "@/lib/site";
import { BeforeAfter } from "@/components/products/BeforeAfter";
import { BuyButton } from "@/components/products/BuyButton";
import { JsonLd } from "@/components/ui/JsonLd";

export function generateStaticParams() {
  return lutPacks.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/luts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getLutPack(slug);
  if (!p) return {};
  return {
    title: `${p.name} LUT Pack — ${p.count} cinematic LUTs`,
    description: `${p.description} ${p.count} .cube LUTs for ${p.software.slice(0, 3).join(", ")} and more.`,
    alternates: { canonical: `/luts/${p.slug}` },
    openGraph: { title: `Prograde ${p.name} LUT Pack`, description: p.subtitle, images: [{ url: p.image.src, alt: p.image.alt }] },
  };
}

async function Product({ params }: { params: PageProps<"/luts/[slug]">["params"] }) {
  const { slug } = await params;
  const p = getLutPack(slug);
  if (!p) notFound();
  const others = lutPacks.filter((o) => o.slug !== p.slug);
  const item = `Prograde ${p.name} LUT pack`;

  return (
    <article className="page-enter px-[var(--gutter)] pb-32 pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: item,
          description: p.description,
          image: p.image.src,
          brand: { "@type": "Brand", name: site.brand },
          offers: { "@type": "Offer", price: p.price, priceCurrency: site.currency, availability: "https://schema.org/InStock", url: `${site.url}/luts/${p.slug}` },
        }}
      />
      <div className="mx-auto max-w-[1600px]">
        <nav aria-label="Breadcrumb" className="meta mb-10 flex gap-3 text-muted">
          <Link href="/#luts" className="link-u text-ink-2">
            LUT store
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{p.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Preview */}
          <div className="lg:col-span-8">
            <BeforeAfter image={p.image} grade={p.grade} gradeName={p.name} ratio={16 / 10} sizes="(min-width: 1024px) 66vw, 100vw" mode="drag" preload className="frame-marks" />
            <p className="meta mt-3 text-muted">Drag to compare — left: LOG, right: {p.name}</p>
          </div>

          {/* Buy panel — CTA above the fold, never behind animation */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="meta text-amber">
                {p.count} LUTs · .cube · LOG + Rec.709
              </p>
              <h1 className="display mt-4 text-[clamp(2.8rem,5vw,4.8rem)]">{p.name}</h1>
              <p className="serif mt-3 text-2xl italic text-ink-2">{p.subtitle}</p>
              <p className="mt-6 text-sm leading-relaxed text-ink-2">{p.description}</p>

              <p className="mt-8 flex items-baseline gap-3">
                <span className="text-4xl font-semibold tracking-[-0.02em]">{formatPrice(p.price)}</span>
                {p.compareAt && (
                  <>
                    <s className="meta text-muted">{formatPrice(p.compareAt)}</s>
                    <span className="meta text-amber">−{Math.round((1 - p.price / p.compareAt) * 100)}%</span>
                  </>
                )}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <BuyButton item={item} price={p.price} checkoutUrl={p.checkoutUrl} label="Buy now" className="btn btn-amber h-14! justify-center" />
                <p className="meta text-center text-muted">Secure payment · Download link by email</p>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
                <div>
                  <dt className="meta text-muted">LUTs</dt>
                  <dd className="mt-1">{p.count}</dd>
                </div>
                <div>
                  <dt className="meta text-muted">Formats</dt>
                  <dd className="mt-1 text-sm">{p.formats.join(", ")}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="meta text-muted">Best for</dt>
                  <dd className="mt-1 text-sm">{p.bestFor.join(" · ")}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* Details */}
        <div className="mt-28 grid gap-16 border-t border-line pt-16 md:grid-cols-3">
          <section aria-labelledby="sw">
            <h2 id="sw" className="eyebrow mb-5">
              Compatible software
            </h2>
            <ul className="space-y-2 text-ink-2">
              {p.software.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="cam">
            <h2 id="cam" className="eyebrow mb-5">
              Camera profiles
            </h2>
            <ul className="space-y-2 text-ink-2">
              {p.cameras.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="inc">
            <h2 id="inc" className="eyebrow mb-5">
              What&rsquo;s included
            </h2>
            <ul className="space-y-2 text-ink-2">
              <li>{p.count} creative LUTs (.cube, 33-point)</li>
              <li>LOG-input and Rec.709 versions</li>
              <li>PDF installation guide</li>
              <li>Free updates to this pack</li>
            </ul>
          </section>
        </div>

        <section aria-labelledby="install" className="mt-24">
          <h2 id="install" className="display mb-10 text-[clamp(2rem,4vw,3.5rem)]">
            Installation
          </h2>
          <div className="border-t border-line">
            {Object.entries(lutInstallSteps).map(([app, steps], i) => (
              <details key={app} open={i === 0} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xl font-medium [&::-webkit-details-marker]:hidden">
                  {app}
                  <span aria-hidden className="meta transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ol className="max-w-2xl list-decimal space-y-2 pb-8 pl-5 text-ink-2 marker:text-amber">
                  {steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-sell */}
        <section aria-labelledby="more" className="mt-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 id="more" className="display text-[clamp(2rem,4vw,3.5rem)]">
              More looks
            </h2>
            <p className="meta text-ink-2">
              Or get all {lutBundle.count} LUTs for {formatPrice(lutBundle.price)}
            </p>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <BeforeAfter image={o.image} grade={o.grade} gradeName={o.name} ratio={4 / 3} sizes="(min-width: 768px) 33vw, 100vw" mode="hover" />
                <div className="mt-4 flex items-baseline justify-between">
                  <Link href={`/luts/${o.slug}`} className="link-u text-xl font-semibold uppercase tracking-[-0.02em]">
                    {o.name}
                  </Link>
                  <span className="meta text-ink-2">{formatPrice(o.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-black/95 px-4 py-3 lg:hidden">
        <div>
          <p className="text-sm font-semibold uppercase">{p.name}</p>
          <p className="meta text-amber">{formatPrice(p.price)}</p>
        </div>
        <BuyButton item={item} price={p.price} checkoutUrl={p.checkoutUrl} label="Buy now" className="btn btn-amber h-11!" />
      </div>
    </article>
  );
}

export default function Page({ params }: PageProps<"/luts/[slug]">) {
  return (
    <Suspense fallback={<div className="h-svh bg-black" />}>
      <Product params={params} />
    </Suspense>
  );
}
