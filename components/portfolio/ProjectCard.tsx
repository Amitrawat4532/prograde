import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { PlayFilmButton } from "@/components/ui/FilmPlayer";

type Props = {
  project: Project;
  index: number;
  sizes: string;
  /** Tailwind aspect classes, mobile-first */
  aspect?: string;
  large?: boolean;
};

/** A film poster: the whole card links to the project; the play button opens the film. */
export function ProjectCard({ project: p, index, sizes, aspect = "aspect-[4/5]", large = false }: Props) {
  return (
    <article className="group relative h-full">
      <div data-parallax className={`frame-marks relative overflow-hidden bg-panel ${aspect}`}>
        <div className="parallax-media absolute -inset-3">
          <Image
            src={p.cover.src}
            alt={p.cover.alt}
            fill
            sizes={sizes}
            quality={70}
            className="object-cover"
            style={{ objectPosition: `${p.cover.focus ?? 50}% 50%` }}
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30" />

        <p className="meta absolute left-4 top-4 flex items-center gap-2 text-ink sm:left-5 sm:top-5">
          <span className="text-amber">{String(index + 1).padStart(2, "0")}</span>
          <span>{p.category}</span>
        </p>
        <p className="meta absolute right-4 top-4 text-ink-2 sm:right-5 sm:top-5">{p.year}</p>

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <h3
            className={`font-semibold uppercase leading-[0.92] tracking-[-0.035em] ${large ? "text-[clamp(2.4rem,7vw,5.5rem)]" : "text-[clamp(1.8rem,7.5vw,2.4rem)]"}`}
          >
            <Link href={`/work/${p.slug}`} data-cursor="Explore" className="after:absolute after:inset-0 after:content-['']">
              {p.title}
            </Link>
          </h3>
          <p className="serif mt-1.5 text-lg italic text-ink-2">{p.artist}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="meta border border-line-strong px-2 py-1 text-[0.6rem]! text-ink">{p.role}</span>
            <PlayFilmButton id={p.youtubeId} title={`${p.title} — ${p.artist}`} label="" className="relative z-10" />
          </div>
        </div>
      </div>
      {large && <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-2">{p.logline}</p>}
    </article>
  );
}
