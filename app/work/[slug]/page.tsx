import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProject, projects } from "@/lib/content";
import { site } from "@/lib/site";
import { LiteYouTube } from "@/components/ui/LiteYouTube";
import { RevealText } from "@/components/animations/RevealText";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.artist} (${p.category}, ${p.year})`,
    description: `${p.logline} ${p.role}: ${site.name}.`,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} — ${site.brand}`, description: p.logline, images: [{ url: p.cover.src, alt: p.cover.alt }] },
  };
}

async function Project({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const pos = (s: { focus?: number }) => `${s.focus ?? 50}% 50%`;

  return (
    <article className="page-enter">
      {/* Title card */}
      {/* Phones: widescreen band (720p frames stay sharp). Desktop: full-bleed title card. */}
      <header className="relative pt-16 lg:flex lg:h-[82svh] lg:min-h-[520px] lg:items-end lg:overflow-hidden lg:pt-0">
        <div className="relative aspect-[16/9] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
          <Image src={p.cover.src} alt={p.cover.alt} fill preload sizes="100vw" quality={80} className="object-cover" style={{ objectPosition: pos(p.cover) }} />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:from-black lg:via-black/30 lg:to-black/50" />
        </div>
        <div className="relative w-full px-[var(--gutter)] pb-6 pt-6 lg:pb-14 lg:pt-0">
          <div className="mx-auto max-w-[1600px]">
            <Link href="/#work" className="meta link-u text-ink-2">
              ← All films
            </Link>
            <p className="meta mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-2">
              <span className="text-amber">{String(i + 1).padStart(2, "0")}</span>
              <span>{p.category}</span>
              <span aria-hidden>·</span>
              <span>{p.year}</span>
              <span aria-hidden>·</span>
              <span>{p.label}</span>
            </p>
            <h1 className="display mt-4 text-[clamp(3rem,14vw,12rem)]">{p.title}</h1>
            <p className="serif mt-2 text-[clamp(1.25rem,2.4vw,2rem)] italic text-ink-2">{p.artist}</p>
            <p className="meta mt-5 inline-block border border-line-strong px-2.5 py-1.5 text-ink">Subodit — {p.role}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-[var(--gutter)]">
        {/* The film */}
        <section aria-label="Watch the film" className="-mx-[var(--gutter)] py-10 sm:mx-0 md:py-20">
          <LiteYouTube id={p.youtubeId} title={`${p.title} — ${p.artist}`} poster={p.stills[1].src} />
        </section>

        <section aria-label="About the film" className="grid gap-10 border-y border-line py-12 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">About the film</p>
            <p className="text-[clamp(1.15rem,2vw,1.8rem)] leading-[1.45] tracking-[-0.01em]">{p.synopsis}</p>
          </div>
          <dl className="grid grid-cols-1 gap-y-4 self-start sm:grid-cols-2 sm:gap-x-8 lg:col-span-4 lg:col-start-9">
            {p.credits.map((c) => (
              <div key={c.role} className="border-t border-line pt-2.5">
                <dt className="meta text-muted">{c.role}</dt>
                <dd className={`mt-1 text-sm ${/subodit/i.test(c.name) ? "text-amber" : "text-ink"}`}>{c.name}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Stills — real frames from the film */}
        <section aria-label="Stills" className="grid grid-cols-2 gap-2 py-12 md:gap-4 md:py-20">
          {p.stills.map((s, idx) => (
            <figure key={s.src} data-reveal="clip" className={`relative overflow-hidden bg-panel ${idx === 0 ? "col-span-2 aspect-[2.39/1]" : "aspect-[4/5] md:aspect-video"}`}>
              <Image src={s.src} alt={s.alt} fill sizes={idx === 0 ? "100vw" : "50vw"} quality={70} className="object-cover" style={{ objectPosition: pos(s) }} />
            </figure>
          ))}
        </section>
      </div>

      {/* Next film */}
      <Link href={`/work/${next.slug}`} className="group relative block h-[55svh] overflow-hidden md:h-[70svh]" data-cursor="Next">
        <Image src={next.cover.src} alt="" fill sizes="100vw" quality={60} className="object-cover opacity-50 transition-[opacity,transform] duration-[1400ms] ease-[var(--ease-out)] group-hover:scale-[1.04] group-hover:opacity-70" style={{ objectPosition: pos(next.cover) }} />
        <div className="relative flex h-full flex-col items-center justify-center px-[var(--gutter)] text-center">
          <p className="meta text-ink-2">Next film</p>
          <RevealText as="p" lines={[next.title]} className="display mt-3 text-[clamp(2.6rem,11vw,10rem)]" />
          <p className="serif mt-2 text-lg italic text-ink-2">{next.artist}</p>
        </div>
      </Link>
    </article>
  );
}

export default function Page({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<div className="h-svh bg-black" />}>
      <Project params={params} />
    </Suspense>
  );
}
