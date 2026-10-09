import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { courses, getCourse } from "@/lib/content";
import { formatPrice, site } from "@/lib/site";
import { BuyButton } from "@/components/products/BuyButton";
import { JsonLd } from "@/components/ui/JsonLd";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourse(slug);
  if (!c) return {};
  return {
    title: `${c.title} — Online course`,
    description: c.description,
    alternates: { canonical: `/courses/${c.slug}` },
    openGraph: { title: `${c.title} — ${site.brand}`, description: c.description, images: [{ url: c.image.src, alt: c.image.alt }] },
  };
}

async function CourseDetail({ params }: { params: PageProps<"/courses/[slug]">["params"] }) {
  const { slug } = await params;
  const c = getCourse(slug);
  if (!c) notFound();
  const others = courses.filter((o) => o.slug !== c.slug);

  return (
    <article className="page-enter">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: c.title,
          description: c.description,
          provider: { "@type": "Person", name: site.name, sameAs: site.social.instagram },
          offers: { "@type": "Offer", price: c.price, priceCurrency: site.currency, category: "Paid" },
        }}
      />
      <header className="relative pt-16 lg:flex lg:min-h-[86svh] lg:items-end lg:overflow-hidden lg:pt-0">
        <div className="relative aspect-[16/9] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
          <Image src={c.image.src} alt={c.image.alt} fill preload sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: `${c.image.focus ?? 50}% 50%` }} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:from-black lg:via-black/50 lg:to-black/30" />
        </div>
        <div className="relative w-full px-[var(--gutter)] pb-10 pt-6 lg:pb-14 lg:pt-32">
          <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Link href="/#courses" className="meta link-u text-ink-2">
                ← All courses
              </Link>
              <p className="meta mt-10 text-amber">{c.kicker}</p>
              <h1 className="display mt-4 text-[clamp(3rem,9vw,9rem)]">{c.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{c.description}</p>
            </div>
            <div className="border border-line bg-black/70 p-6 lg:col-span-4">
              <p className="flex items-baseline gap-3">
                <span className="text-4xl font-semibold tracking-[-0.02em]">{formatPrice(c.price)}</span>
                {c.compareAt && <s className="meta text-muted">{formatPrice(c.compareAt)}</s>}
              </p>
              <dl className="meta mt-6 grid grid-cols-2 gap-4 text-[0.62rem]!">
                <div><dt className="text-muted">Lessons</dt><dd className="mt-1 text-ink">{c.lessons}</dd></div>
                <div><dt className="text-muted">Duration</dt><dd className="mt-1 text-ink">{c.duration}</dd></div>
                <div><dt className="text-muted">Level</dt><dd className="mt-1 text-ink">{c.level}</dd></div>
                <div><dt className="text-muted">Format</dt><dd className="mt-1 text-ink">{c.format}</dd></div>
              </dl>
              <div className="mt-6">
                <BuyButton item={`Prograde ${c.title} course`} price={c.price} checkoutUrl={c.checkoutUrl} kind="course" label="Enroll now" className="btn btn-amber h-14! w-full justify-center" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-[var(--gutter)] py-28">
        <div className="grid gap-20 lg:grid-cols-12">
          <section aria-labelledby="learn" className="lg:col-span-5">
            <h2 id="learn" className="display text-[clamp(2rem,4vw,3.5rem)]">
              You&rsquo;ll learn <span className="serif italic normal-case tracking-normal text-ink-2">to</span>
            </h2>
            <ul className="mt-10 border-t border-line">
              {c.outcomes.map((o, i) => (
                <li key={o} className="flex gap-6 border-b border-line py-5 text-lg">
                  <span className="meta pt-1.5 text-amber">{String(i + 1).padStart(2, "0")}</span>
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="curriculum" className="lg:col-span-6 lg:col-start-7">
            <h2 id="curriculum" className="display text-[clamp(2rem,4vw,3.5rem)]">
              Curriculum
            </h2>
            <div className="mt-10 border-t border-line">
              {c.modules.map((m, i) => (
                <details key={m.title} open={i === 0} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-baseline gap-6 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="meta text-muted">Module {i + 1}</span>
                    <span className="text-xl font-medium">{m.title}</span>
                    <span aria-hidden className="meta ml-auto transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <ol className="space-y-2 pb-6 pl-24 text-ink-2">
                    {m.lessons.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </section>
        </div>

        <section aria-labelledby="other" className="mt-32">
          <h2 id="other" className="eyebrow mb-8">
            Other courses
          </h2>
          <ul className="grid gap-px border border-line bg-line md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} className="bg-black">
                <Link href={`/courses/${o.slug}`} className="group block p-8 transition-colors hover:bg-panel">
                  <p className="meta text-muted">
                    {o.lessons} lessons · {o.duration}
                  </p>
                  <p className="mt-4 text-2xl font-semibold uppercase leading-none tracking-[-0.03em]">{o.title}</p>
                  <p className="meta mt-6 text-ink-2 transition-colors group-hover:text-amber">
                    {formatPrice(o.price)} — View →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

export default function Page({ params }: PageProps<"/courses/[slug]">) {
  return (
    <Suspense fallback={<div className="h-svh bg-black" />}>
      <CourseDetail params={params} />
    </Suspense>
  );
}
