import Image from "next/image";
import { heroReel } from "@/lib/content";
import { site } from "@/lib/site";
import { ActionDialog } from "@/components/ui/ActionDialog";
import { ScrollTilt } from "@/components/animations/ScrollTilt";
import { RevealText } from "@/components/animations/RevealText";

const capabilities = ["Premium web design", "3D & interactive", "Shopify", "WordPress", "Next.js", "Performance-first"];

/**
 * The collaboration credit — framed like part of the film's credits rather
 * than an ad: this site itself is the case study.
 */
export function WebCollab() {
  return (
    <section id="build" aria-labelledby="build-title" className="relative overflow-hidden bg-[#0b0b0a] px-[var(--gutter)] py-20 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <p className="meta mb-10 border-y border-line py-3 text-ink-2 md:mb-14">
          06 — This site: {site.webStudio.label.toLowerCase()} by <span className="text-ink">{site.webStudio.name}</span> × {site.brand}
        </p>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-4" data-reveal="fade">
              Need a website that feels like your brand?
            </p>
            <RevealText
              id="build-title"
              lines={[
                "Your work",
                "deserves a",
                <span key="b">
                  better <span className="serif italic normal-case tracking-normal text-ink-2">digital</span>
                </span>,
                "experience.",
              ]}
              className="display text-[clamp(2.3rem,10vw,5.2rem)]"
            />
            <p data-reveal="fade" className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-ink-2">
              I design and build premium, high-performance websites for creative professionals, brands and businesses —
              like this one, made with {site.name}.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {capabilities.map((c) => (
                <li key={c} className="meta border border-line px-2.5 py-1.5 text-[0.6rem]! text-ink-2">
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ActionDialog
                label={
                  <>
                    Build my website <span className="arrow" aria-hidden>→</span>
                  </>
                }
                className="btn btn-solid w-full justify-center sm:w-auto"
                cursor="Let's talk"
                kind="website"
                variant="website"
                title="Let’s build it"
                intro={<p>Tell me about your brand. You&rsquo;ll hear back from {site.webStudio.name} within a day.</p>}
                submitLabel="Send project brief"
              />
            </div>
          </div>

          {/* The case study: this site, in a browser frame */}
          <ScrollTilt className="lg:col-span-6">
            <figure className="overflow-hidden border border-line-strong bg-black">
              <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[#3a3835]" />
                <span className="h-2 w-2 rounded-full bg-[#3a3835]" />
                <span className="h-2 w-2 rounded-full bg-[#3a3835]" />
                <span className="meta ml-3 truncate text-[0.58rem]! text-muted">{site.url.replace(/^https?:\/\//, "")}</span>
              </div>
              <div className="relative aspect-[16/10]">
                <Image src={heroReel[0].src} alt="" fill sizes="(min-width: 1024px) 45vw, 92vw" quality={55} className="object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
                <p aria-hidden className="absolute bottom-[8%] left-[6%] text-[clamp(1.6rem,7vw,4.6rem)] font-semibold uppercase leading-[0.85] tracking-[-0.045em]">
                  Subodit
                  <br />
                  Arya
                </p>
              </div>
              <figcaption className="meta flex justify-between border-t border-line px-3 py-2.5 text-[0.58rem]! text-muted">
                <span>Case study</span>
                <span>Next.js · Three.js · GSAP</span>
              </figcaption>
            </figure>
          </ScrollTilt>
        </div>
      </div>
    </section>
  );
}
