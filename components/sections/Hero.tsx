"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { heroReel, projects } from "@/lib/content";
import { site } from "@/lib/site";
import { PauseOffscreen } from "@/components/animations/PauseOffscreen";
import { playFilm } from "@/components/ui/FilmPlayer";

const latest = projects[0];
const SLIDE = 6; // seconds per frame in the reel

export function Hero() {
  const root = useRef<HTMLElement>(null);

  /* ---------- intro sequence ---------- */
  useEffect(() => {
    const el = root.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);

    if (reduced) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {}
    // Phones get a tighter cut; returning visitors an even shorter one.
    const phone = matchMedia("(max-width: 767px)").matches;
    const k = (seen ? 0.45 : 1) * (phone ? 0.7 : 1);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(q("[data-hero-slate]"), { opacity: 1, duration: 0.6 * k, ease: "power2.out" }, 0.15 * k)
        .to(q("[data-hero-slate]"), { opacity: 0, duration: 0.5 * k, ease: "power2.in" }, 0.95 * k)
        .to(q("[data-hero-black]"), { opacity: 0, duration: 1.6 * k, ease: "power2.inOut" }, 1.1 * k)
        .set(q("[data-hero-black]"), { display: "none" })
        .fromTo(q("[data-hero-media]"), { scale: 1.18 }, { scale: 1, duration: 3.4 * k, ease: "power3.out" }, 1.1 * k)
        .to(q("[data-hero-sharp]"), { opacity: 1, duration: 2.2 * k, ease: "power2.inOut" }, 1.4 * k)
        .set(q("[data-hero-soft]"), { visibility: "hidden" })
        .to(q("[data-hero-line] > span"), { y: 0, duration: 1.4, stagger: 0.1 }, 1.4 * k)
        .to(q("[data-hero-fade]"), { opacity: 1, y: 0, duration: 1.1, stagger: 0.07 }, 1.9 * k)
        .to(q("[data-hero-cta]"), { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 2.4 * k);
    }, el);

    return () => ctx.revert();
  }, []);

  /* ---------- scroll transition (all screens) + mouse parallax (desktop) ---------- */
  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
      tl.to(q("[data-hero-copy]"), { yPercent: -30, opacity: 0, duration: 0.55 }, 0)
        .to(q("[data-hero-meta], [data-hero-chip]"), { opacity: 0, duration: 0.3 }, 0)
        .to(q("[data-hero-push]"), { scale: 1.25, duration: 1 }, 0)
        .to(q("[data-hero-dim]"), { opacity: 0.85, duration: 0.6 }, 0.4)
        .to(q("[data-bar]"), { scaleY: 1, duration: 0.7, ease: "power1.inOut" }, 0.3);

      const xTo = gsap.quickTo(q("[data-hero-parallax]"), "x", { duration: 1.2, ease: "power3.out" });
      const yTo = gsap.quickTo(q("[data-hero-parallax]"), "y", { duration: 1.2, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const mx = (e.clientX / innerWidth) * 2 - 1;
        const my = (e.clientY / innerHeight) * 2 - 1;
        xTo(mx * -12);
        yTo(my * -8);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });

    // Phones & tablets: the same scene as desktop. At rest the frame is a sharp
    // widescreen band; on scroll it grows to fill the whole screen, the copy lifts
    // away, the letterbox closes and everything fades to black — like desktop.
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const band = q("[data-hero-push]")[0] as HTMLElement;
      const stage = () => band.offsetParent as HTMLElement;
      // Layout offsets (not getBoundingClientRect) so a refresh mid-scroll ignores the current transform.
      const toCentre = () => stage().clientHeight / 2 - (band.offsetTop + band.offsetHeight / 2);
      const toFill = () => (stage().clientHeight / band.offsetHeight) * 1.04;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      tl.to(q("[data-hero-copy]"), { yPercent: -30, opacity: 0, duration: 0.45 }, 0)
        .to(q("[data-hero-chip]"), { opacity: 0, y: -12, duration: 0.3 }, 0)
        // Push in towards the subjects' faces (frames are framed right-of-centre), not the middle.
        .set(band, { transformOrigin: "62% 50%" }, 0)
        .to(band, { y: toCentre, scale: toFill, duration: 1, ease: "power2.inOut" }, 0)
        .to(q("[data-hero-dim]"), { opacity: 0.9, duration: 0.6 }, 0.4)
        .to(q("[data-bar]"), { scaleY: 1, duration: 0.7, ease: "power1.inOut" }, 0.3);
    });

    return () => mm.revert();
  }, []);

  const reelStyle = (i: number) =>
    ({ "--dur": `${heroReel.length * SLIDE}s`, "--delay": `${i * SLIDE}s` }) as CSSProperties;

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="hero relative h-[160svh] lg:h-[160vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Background: a reel of real frames from his films */}
        {/* Phones: a sharp widescreen band (frames are 720p). Desktop: full-bleed. */}
        <div data-hero-push className="absolute inset-x-0 top-[19svh] aspect-[16/10] overflow-hidden will-change-transform lg:inset-0 lg:aspect-auto">
          <div data-hero-parallax className="absolute -inset-4">
            <div data-hero-media className="vignette absolute inset-0">
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
                  {heroReel.map((s, i) => (
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

        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgb(5_5_5/0.6)_0%,rgb(5_5_5/0.1)_30%,rgb(5_5_5/0.35)_58%,rgb(5_5_5/0.97)_100%)] lg:block"
        />

        <div data-hero-dim aria-hidden className="pointer-events-none absolute inset-0 bg-black opacity-0" />

        {/* Now playing — opens the latest film */}
        <button
          type="button"
          data-hero-fade
          data-hero-chip
          onClick={() => playFilm({ id: latest.youtubeId, title: `${latest.title} — ${latest.artist}` })}
          className="group absolute left-[var(--gutter)] top-24 z-10 flex max-w-[calc(100%-2*var(--gutter))] items-center gap-3 border border-line-strong bg-black/45 py-1.5 pl-1.5 pr-4 text-left lg:top-28"
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
