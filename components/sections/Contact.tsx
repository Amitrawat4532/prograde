import { site } from "@/lib/site";
import { RevealText } from "@/components/animations/RevealText";
import { PauseOffscreen } from "@/components/animations/PauseOffscreen";
import { ActionDialog } from "@/components/ui/ActionDialog";

export function Contact() {
  const rows = [
    site.contact.email && { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { label: "Instagram", value: `@${site.handle}`, href: site.social.instagram },
    site.social.youtube && { label: "YouTube", value: "Watch the films", href: site.social.youtube },
    { label: "Based in", value: site.basedIn, href: null },
  ].filter(Boolean) as { label: string; value: string; href: string | null }[];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-black px-[var(--gutter)] pb-16 pt-20 md:pb-24 md:pt-36">
      <PauseOffscreen className="pointer-events-none absolute inset-0">
        <div className="leak left-[-10%] top-[10%] h-[70vmax] w-[70vmax] bg-[radial-gradient(circle,rgb(217_164_91/0.16),transparent_60%)]" />
        <div className="leak bottom-[-30%] right-[-20%] h-[60vmax] w-[60vmax] bg-[radial-gradient(circle,rgb(196_53_43/0.10),transparent_60%)] [animation-delay:-9s]" />
      </PauseOffscreen>

      <div className="relative mx-auto max-w-[1600px]">
        <p className="eyebrow mb-6" data-reveal="fade">
          07 — Contact
        </p>
        <RevealText
          id="contact-title"
          lines={[
            "Let’s create",
            <span key="s">
              something <span className="serif italic normal-case tracking-normal text-amber">worth</span>
            </span>,
            "watching.",
          ]}
          className="display text-[clamp(2.6rem,11.5vw,11rem)]"
        />

        <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:order-2 lg:col-span-4 lg:col-start-9">
            <a href={site.social.instagramDm} target="_blank" rel="noreferrer" className="btn btn-amber justify-center">
              Message on Instagram ↗
            </a>
            <ActionDialog
              label={
                <>
                  Start a project <span className="arrow" aria-hidden>→</span>
                </>
              }
              className="btn w-full justify-center"
              cursor="Write"
              kind="booking"
              variant="booking"
              title="Start a project"
              intro={<p>Dates, location, references, budget — whatever you have so far.</p>}
              submitLabel="Send"
            />
            <p className="mt-1 text-sm leading-relaxed text-ink-2">Music videos, brand films, commercials and remote colour grading. Fastest reply on Instagram.</p>
          </div>

          <dl className="border-t border-line lg:order-1 lg:col-span-7">
            {rows.map((r) => (
              <div key={r.label} className="group flex items-baseline justify-between gap-4 border-b border-line py-4 md:py-6">
                <dt className="meta text-muted">{r.label}</dt>
                <dd className="text-right text-[clamp(1.05rem,2.4vw,2rem)] font-medium tracking-[-0.02em]">
                  {r.href ? (
                    <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="link-u">
                      {r.value} <span className="text-muted transition-colors group-hover:text-amber">↗</span>
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
