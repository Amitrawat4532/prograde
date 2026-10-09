"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useInView, useTier } from "@/lib/hooks";
import { heroStage } from "@/lib/stage";
import { heroReel, projects } from "@/lib/content";
import { site } from "@/lib/site";
import { PauseOffscreen } from "@/components/animations/PauseOffscreen";
import { playFilm } from "@/components/ui/FilmPlayer";

const HeroScreen = dynamic(() => import("@/components/3d/HeroScreen"), { ssr: false });

const latest = projects[0];
const SLIDE = 6; // seconds per frame in the CSS fallback reel

/**
 * One scene for every screen size. The picture is a WebGL "cinema screen"
 * (components/3d/HeroScreen) — zoom, focus pull, transitions and colour fringing
 * all happen in a shader, so scrolling never scales or re-rasterises DOM layers.
 * Plain images underneath are the LCP and the no-WebGL / reduced-motion fallback.
 *
 * Rule that keeps it glitch-free: the intro and the scroll timeline never touch
 * the same element — intro animates inner nodes, scroll animates their wrappers.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const tier = useTier();
  const inView = useInView(root, "0px");
  const [glReady, setGlReady] = useState(false);
  const onReady = useCallback(() => setGlReady(true), []);

  /* ---------- intro ---------- */
  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroStage.intro = 1;
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    const phone = matchMedia("(max-width: 767px)").matches;
    const k = (seen ? 0.45 : 1) * (phone ? 0.7 : 1);

    heroStage.intro = 0;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(q("[data-hero-slate]"), { opacity: 1, duration: 0.6 * k, ease: "power2.out" }, 0.15 * k)
        .to(q("[data-hero-slate]"), { opacity: 0, duration: 0.5 * k, ease: "power2.in" }, 0.95 * k)
        .to(q("[data-hero-black]"), { opacity: 0, duration: 1.6 * k, ease: "power2.inOut" }, 1.1 * k)
        .set(q("[data-hero-black]"), { display: "none" })
        // the focus pull: shader (heroStage.intro) + the fallback image
        .to(heroStage, { intro: 1, duration: 3 * k, ease: "power3.out" }, 1.1 * k)
        .fromTo(q("[data-hero-media]"), { scale: 1.14 }, { scale: 1, duration: 3 * k, ease: "power3.out" }, 1.1 * k)
        .to(q("[data-hero-sharp]"), { opacity: 1, duration: 2 * k, ease: "power2.inOut" }, 1.3 * k)
        .set(q("[data-hero-soft]"), { visibility: "hidden" })
        .to(q("[data-hero-line] > span"), { y: 0, duration: 1.4, stagger: 0.1 }, 1.4 * k)
        .to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 1.9 * k)
        .to(q("[data-hero-cta]"), { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 2.4 * k);
    }, el);
    return () => ctx.revert();
  }, []);

  /* ---------- scroll: the same scene on every screen ---------- */
  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        fine: "(hover: hover) and (pointer: fine)",
      },
      (c) => {
        const { motion, fine } = c.conditions as { motion: boolean; fine: boolean };
        if (!motion) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          // Report the *smoothed* progress so the shader and the DOM move together.
          onUpdate() {
            heroStage.scroll = this.progress();
          },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            // Lenis already smooths desktop scrolling — no second layer of lag there.
            scrub: fine ? true : 0.3,
          },
        });
        tl.to(q("[data-hero-copy]"), { yPercent: -30, opacity: 0, duration: 0.55 }, 0)
          .to(q("[data-hero-meta], [data-hero-chip]"), { opacity: 0, y: -12, duration: 0.3 }, 0)
          .to(q("[data-hero-push]"), { scale: 1.2, duration: 1 }, 0) // fallback only; the shader zooms itself
          .to(q("[data-hero-dim]"), { opacity: 0.88, duration: 0.6 }, 0.4)
          .to(q("[data-bar]"), { scaleY: 1, duration: 0.7, ease: "power1.inOut" }, 0.3);

        if (!fine) return () => (heroStage.scroll = 0);

        const xTo = gsap.quickTo(q("[data-hero-parallax]"), "x", { duration: 1.2, ease: "power3.out" });
        const yTo = gsap.quickTo(q("[data-hero-parallax]"), "y", { duration: 1.2, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const mx = (e.clientX / innerWidth) * 2 - 1;
          const my = (e.clientY / innerHeight) * 2 - 1;
          heroStage.mx = mx;
          heroStage.my = my;
          xTo(mx * -12);
          yTo(my * -8);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          window.removeEventListener("pointermove", onMove);
          heroStage.scroll = 0;
        };
      },
    );
    return () => mm.revert();
  }, []);

  const reelStyle = (i: number) =>
    ({ "--dur": `${heroReel.length * SLIDE}s`, "--delay": `${i * SLIDE}s` }) as CSSProperties;

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="hero relative h-[160svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
        {/* Fallback / LCP picture — hidden (and its CSS reel stopped) once WebGL is up */}
        <div data-hero-push className={`absolute inset-0 ${glReady ? "invisible" : ""}`}>
          <div data-hero-parallax className="absolute -inset-4">
            <div data-hero-media className="absolute inset-0">
              <Image
                data-hero-soft
                src={heroReel[0].src}
                alt=""
                fill
                sizes="6vw"
                quality={55}
                className="scale-110 object-cover blur-xl"
                style={{ objectPosition: `${heroReel[0].focus}% 50%` }}
                aria-hidden
              />
              <PauseOffscreen className="absolute inset-0">
                <div data-hero-sharp className="hero-reel absolute inset-0">
                  {(glReady ? heroReel.slice(0, 1) : heroReel).map((s, i) => (
                    <div key={s.src} className="reel-frame absolute inset-0" style={reelStyle(i)}>
                      <Image
                        src={s.src}
                        alt={i === 0 ? s.alt : ""}
                        aria-hidden={i !== 0}
                        fill
                        preload={i === 0}
                        fetchPriority={i === 0 ? "high" : "low"}
                        sizes="100vw"
                        quality={80}
                        className="object-cover"
                        style={{ objectPosition: `${s.focus}% 50%` }}
                      />
                    </div>
                  ))}
                </div>
              </PauseOffscreen>
            </div>
          </div>
        </div>

        {/* The WebGL cinema screen */}
        {tier !== "off" && (
          <div aria-hidden className={`absolute inset-0 transition-opacity duration-700 ${glReady ? "opacity-100" : "opacity-0"}`}>
            <HeroScreen frames={heroReel} active={inView} lite={tier === "lite"} onReady={onReady} />
          </div>
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_5/0.55)_0%,rgb(5_5_5/0.05)_28%,rgb(5_5_5/0.3)_55%,rgb(5_5_5/0.97)_100%)]"
        />
        <div data-hero-dim aria-hidden className="pointer-events-none absolute inset-0 bg-black opacity-0" />

        {/* Now playing — wrapper scrolls away, inner button handles the intro */}
        <div data-hero-chip className="absolute left-[var(--gutter)] top-24 z-10 max-w-[calc(100%-2*var(--gutter))] lg:top-28">
          <button
            type="button"
            data-hero-fade
            onClick={() => playFilm({ id: latest.youtubeId, title: `${latest.title} — ${latest.artist}` })}
            className="group flex w-full items-center gap-3 border border-line-strong bg-black/45 py-1.5 pl-1.5 pr-4 text-left"
            data-cursor="Play"
          >
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center bg-ink text-black">
              <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-black" />
            </span>
            <span className="min-w-0">
              <span className="meta block text-[0.58rem]! text-amber">New release · {latest.year}</span>
              <span className="block truncate text-sm font-medium">
                {latest.title} <span className="text-ink-2">— {latest.artist}</span>
              </span>
            </span>
          </button>
        </div>

        {/* Copy */}
        <div data-hero-copy className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pb-[6vh]">
          <div className="mx-auto grid max-w-[1600px] items-end gap-5 lg:grid-cols-[1fr_auto] lg:gap-8">
            <div>
              <p data-hero-fade className="eyebrow mb-3 flex items-center gap-2.5 text-ink-2! lg:mb-6">
                <span className="rec" aria-hidden /> {site.brand} · {site.basedIn}
              </p>
              <h1 id="hero-title" className="display text-[clamp(4rem,21vw,15.5rem)]">
                <span data-hero-line className="block overflow-hidden pb-[0.04em]">
                  <span className="block">Subodit</span>
                </span>
                <span data-hero-line className="block overflow-hidden pb-[0.04em]">
                  <span className="block">Arya</span>
                </span>
                <span className="sr-only"> — Cinematographer, Director and Colourist</span>
              </h1>
            </div>

            <div className="flex flex-col gap-5 lg:items-end lg:gap-7 lg:pb-2 lg:text-right">
              <div data-hero-fade className="lg:flex lg:flex-col lg:items-end lg:gap-6">
                <p aria-hidden className="meta text-ink lg:hidden">
                  {site.role} · {site.roles.join(" · ")}
                </p>
                <p aria-hidden className="hidden text-[clamp(0.85rem,1.6vw,1.5rem)] font-semibold uppercase leading-[1.1] tracking-[0.02em] lg:block">
                  {site.role}
                  <br />
                  <span className="text-ink-2">{site.roles.join(" / ")}</span>
                </p>
                <p className="serif hidden max-w-xs text-2xl italic leading-snug text-ink-2 lg:block">{site.tagline}</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                <Link data-hero-cta href="#work" className="btn btn-solid justify-center px-3! sm:px-6!" data-cursor="Explore">
                  Explore work
                </Link>
                <Link data-hero-cta href="#luts" className="btn justify-center px-3! sm:px-6!">
                  Shop LUTs
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div data-hero-meta aria-hidden className="meta pointer-events-none absolute right-[var(--gutter)] top-28 hidden flex-col items-end gap-1 text-ink-2 lg:flex">
          <span data-hero-fade>2.39 : 1 — 24 FPS</span>
          <span data-hero-fade>@{site.handle}</span>
        </div>

        <div aria-hidden data-bar className="absolute inset-x-0 top-0 z-[1] h-[30svh] origin-top scale-y-0 bg-black lg:h-[34vh]" />
        <div aria-hidden data-bar className="absolute inset-x-0 bottom-0 z-[1] h-[30svh] origin-bottom scale-y-0 bg-black lg:h-[34vh]" />

        <div data-hero-black aria-hidden className="hero-black absolute inset-0 z-30 bg-black">
          <p data-hero-slate className="meta absolute inset-0 grid place-items-center text-ink-2 opacity-0">
            <span>
              <span className="rec mr-3 align-middle" /> {site.brandUpper} — {site.name}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
