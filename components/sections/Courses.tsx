import { courses } from "@/lib/content";
import { RevealText } from "@/components/animations/RevealText";
import { CourseCard } from "@/components/courses/CourseCard";
import { ParallaxGroup } from "@/components/portfolio/ParallaxGroup";
import { Rail } from "@/components/ui/Rail";

export function Courses() {
  return (
    <section id="courses" aria-labelledby="courses-title" className="relative bg-[#0a0a09] px-[var(--gutter)] py-20 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-5" data-reveal="fade">
              04 — Prograde courses
            </p>
            <RevealText
              id="courses-title"
              lines={[
                "Learn",
                <span key="s">
                  to <span className="serif italic normal-case tracking-normal">see.</span>
                </span>,
              ]}
              className="display text-[clamp(3.2rem,15vw,9rem)]"
            />
          </div>
          <p data-reveal="fade" className="max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
            The workflow behind his films, taught step by step — starting with the live colour grading class.
          </p>
        </header>

        <ParallaxGroup>
          <Rail count={courses.length} label="Courses" desktopGrid="lg:grid-cols-4">
            {courses.map((c, i) => (
              <li key={c.slug} className="w-[74%] shrink-0 pr-3 sm:w-[44%] lg:w-auto lg:pr-0">
                <CourseCard course={c} index={i} />
              </li>
            ))}
          </Rail>
        </ParallaxGroup>
      </div>
    </section>
  );
}
