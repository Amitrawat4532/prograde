import Image from "next/image";
import { about, media, services } from "@/lib/content";
import { site } from "@/lib/site";
import { RevealText } from "@/components/animations/RevealText";
import { Marquee } from "@/components/animations/Marquee";
import { ActionDialog } from "@/components/ui/ActionDialog";

/** About + services in one section — shorter page, same story. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-black pt-20 md:pt-32">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-5" data-reveal="fade">
            05 — About
          </p>
          <RevealText
            id="about-title"
            lines={[
              "The person",
              <span key="b">
                behind <span className="serif italic normal-case tracking-normal text-ink-2">the</span>
              </span>,
              "frame.",
            ]}
            className="display text-[clamp(2.8rem,12vw,6rem)]"
          />
          <figure className="mt-8 lg:sticky lg:top-24">
            <div data-reveal="clip" className="frame-marks relative aspect-[16/10] overflow-hidden bg-panel lg:aspect-[4/5]">
              <Image
                src={media.about.src}
                alt={media.about.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={70}
                className="object-cover"
                style={{ objectPosition: `${media.about.focus}% 50%` }}
              />
            </div>
            <figcaption className="meta mt-3 flex justify-between gap-4 text-muted">
              <span>Still — Kaafi Hai (dir. Subodit Arya)</span>
              <span className="hidden sm:inline">@{site.handle}</span>
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-24">
          <p data-reveal="fade" className="serif text-[clamp(1.35rem,5.4vw,2.2rem)] leading-[1.28] text-ink">
            {about.intro}
          </p>
          <p data-reveal="fade" className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ink-2">
            {about.body}
          </p>

          <dl className="mt-10 grid grid-cols-2 border-t border-line sm:grid-cols-4">
            {about.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse border-b border-line py-5 pr-3">
                <dt className="meta mt-1.5 text-[0.6rem]! text-muted">{s.label}</dt>
                <dd className="text-[clamp(1.7rem,3vw,2.6rem)] font-semibold tracking-[-0.03em]">{s.value}</dd>
              </div>
            ))}
          </dl>

          {/* Services — compact */}
          <h3 className="eyebrow mb-4 mt-12">Services</h3>
          <ul className="grid grid-cols-2 gap-x-4 border-t border-line sm:gap-x-8">
            {services.map((s, i) => (
              <li key={s.title} className="group flex gap-3 border-b border-line py-3.5 sm:gap-4 sm:py-4">
                <span className="meta pt-1 text-amber">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-[0.95rem] font-semibold uppercase leading-tight tracking-[-0.02em] sm:text-lg">{s.title}</span>
                  <span className="mt-1 hidden text-sm text-ink-2 sm:block">{s.description}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ActionDialog
              label={
                <>
                  Book a shoot <span className="arrow" aria-hidden>→</span>
                </>
              }
              className="btn btn-solid justify-center"
              cursor="Book"
              kind="booking"
              variant="booking"
              title="Book a shoot"
              intro={<p>Share the idea, dates and location — you&rsquo;ll get a reply with availability and a quote.</p>}
              submitLabel="Send request"
            />
            <p className="meta text-muted">Worked with {about.collaborators.slice(0, 3).join(" · ")}</p>
          </div>
        </div>
      </div>

      <Marquee duration={50} className="mt-16 border-y border-line py-4 md:mt-28 md:py-6">
        {about.locations.map((w) => (
          <span
            key={w}
            className="flex items-center whitespace-nowrap px-6 text-[clamp(2.2rem,8vw,7rem)] font-semibold uppercase leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgb(236_232_225/0.35)] md:px-8"
          >
            {w}
            <span className="serif ml-12 text-[0.5em] italic text-amber [-webkit-text-stroke:0]" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
