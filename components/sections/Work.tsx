import { projects } from "@/lib/content";
import { RevealText } from "@/components/animations/RevealText";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ParallaxGroup } from "@/components/portfolio/ParallaxGroup";
import { Rail } from "@/components/ui/Rail";

/**
 * Mobile-first: one featured film, then the rest as a swipe rail of posters.
 * Replaces the long editorial grid + separate filmstrip.
 */
export function Work() {
  const [featured, ...rest] = projects;
  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-black px-[var(--gutter)] py-20 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-5" data-reveal="fade">
              01 — Selected work
            </p>
            <RevealText id="work-title" lines={["Selected", "work"]} className="display text-[clamp(3.2rem,15vw,9rem)]" />
          </div>
          <p data-reveal="fade" className="max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
            {projects.length} released films, 2023–2026 — shot, edited and graded by Subodit. Tap ▶ to watch.
          </p>
        </header>

        <ParallaxGroup className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7" data-reveal="fade">
            <ProjectCard project={featured} index={0} sizes="(min-width: 1024px) 58vw, 100vw" aspect="aspect-square sm:aspect-[16/10]" large />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <Rail count={rest.length} label="More films">
              {rest.map((p, i) => (
                <li key={p.slug} className="w-[78%] shrink-0 pr-3 sm:w-[46%] lg:w-[78%]">
                  <ProjectCard project={p} index={i + 1} sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 78vw" />
                </li>
              ))}
            </Rail>
          </div>
        </ParallaxGroup>
      </div>
    </section>
  );
}
