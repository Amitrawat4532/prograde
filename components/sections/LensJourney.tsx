"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useInView, useTier } from "@/lib/hooks";
import { journeyStage, range } from "@/lib/stage";

const LensJourneyCanvas = dynamic(() => import("@/components/3d/LensJourneyCanvas"), { ssr: false });

const stages = [
  { n: "01", title: "Distance", body: "Every project starts far away — with a feeling, not a shot list.", at: [0.02, 0.24] },
  { n: "02", title: "Focus", body: "Then we move closer. Lenses chosen for faces, not spec sheets.", at: [0.26, 0.48] },
  { n: "03", title: "Aperture", body: "Light is shaped on set — what to reveal, and what to keep in shadow.", at: [0.5, 0.72] },
  { n: "04", title: "Through the glass", body: "And finally, colour. Where an image becomes a look.", at: [0.74, 0.9] },
] as const;

/**
 * The signature 3D moment — desktop only. Phones, tablets, reduced motion and
 * no-WebGL skip it entirely (renders nothing), keeping the page short and light.
 */
export function LensJourney() {
  const tier = useTier();
  if (tier !== "full") return null;
  return <Journey />;
}

function Journey() {
  const section = useRef<HTMLElement>(null);
  const captions = useRef<(HTMLLIElement | null)[]>([]);
  const wash = useRef<HTMLDivElement>(null);
  const inView = useInView(section, "100px");
  // Fetch three.js only once the section is about a screen away.
  const near = useInView(section, "100% 0px", true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            journeyStage.progress = p;
            captions.current.forEach((el, i) => {
              if (!el) return;
              const [a, b] = stages[i].at;
              const o = Math.min(range(p, a, a + 0.05), 1 - range(p, b - 0.05, b));
              el.style.opacity = String(o);
              el.style.transform = `translate3d(0, ${(1 - o) * 18}px, 0)`;
            });
            if (wash.current) wash.current.style.opacity = String(range(p, 0.86, 1));
          },
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="lens" aria-labelledby="lens-title" className="relative h-[280vh] bg-black">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgb(217_164_91/0.10),transparent_70%)]"
        />
        <div className="absolute inset-0">{near && <LensJourneyCanvas active={inView} lite={false} />}</div>

        <div className="absolute left-0 top-0 px-[var(--gutter)] pt-28">
          <p className="eyebrow mb-4">02 — Process</p>
          <h2 id="lens-title" className="display max-w-[12ch] text-[clamp(2rem,4.5vw,4rem)]">
            How an image <span className="serif italic normal-case tracking-normal text-ink-2">is made</span>
          </h2>
        </div>

        <ol>
          {stages.map((s, i) => (
            <li
              key={s.n}
              ref={(el) => {
                captions.current[i] = el;
              }}
              className="absolute bottom-[12vh] left-[var(--gutter)] max-w-md opacity-0"
            >
              <p className="meta mb-3 text-amber">
                {s.n} / 04 — {s.title}
              </p>
              <p className="text-[clamp(1.4rem,2.4vw,2.2rem)] font-medium leading-[1.15] tracking-[-0.02em]">{s.body}</p>
            </li>
          ))}
        </ol>

        <div
          ref={wash}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3a2614_0%,#140d07_45%,#050505_85%)] opacity-0"
        />
      </div>
    </section>
  );
}
