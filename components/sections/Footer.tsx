import Link from "next/link";
import { site } from "@/lib/site";

/** End credits — the film fades back to black. */
export function Footer() {
  const socials = [
    { label: "Instagram", href: site.social.instagram },
    site.social.youtube && { label: "YouTube", href: site.social.youtube },
    site.contact.email && { label: "Email", href: `mailto:${site.contact.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="relative bg-black px-[var(--gutter)] pb-8 pt-12 md:pb-10 md:pt-24">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <p className="text-sm font-semibold tracking-[0.22em]">{site.brandUpper}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            The studio of {site.name} — {site.role.toLowerCase()}, director & colourist. {site.basedIn}.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Index</p>
          <ul className="space-y-2 text-sm text-ink-2">
            <li><Link className="link-u" href="/#work">Films</Link></li>
            <li><Link className="link-u" href="/#luts">LUT store</Link></li>
            <li><Link className="link-u" href="/#courses">Courses</Link></li>
            <li><Link className="link-u" href="/#about">About</Link></li>
            <li><Link className="link-u" href="/#contact">Contact</Link></li>
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-2 text-sm text-ink-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a className="link-u" href={s.href} target="_blank" rel="noreferrer">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Site</p>
          <p className="text-sm text-ink-2">
            {site.webStudio.label} by{" "}
            <Link className="link-u text-ink" href="/#build">
              {site.webStudio.name}
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1600px] items-end justify-between gap-6 md:mt-24">
        <p aria-hidden className="serif select-none text-[clamp(4rem,16vw,15rem)] italic leading-[0.8] text-ink/10">
          Fin.
        </p>
        <p className="meta pb-3 text-muted">© {site.brand} · {site.name}</p>
      </div>
    </footer>
  );
}
