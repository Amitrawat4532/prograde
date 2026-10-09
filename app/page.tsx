import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { LensJourney } from "@/components/sections/LensJourney";
import { LutStore } from "@/components/sections/LutStore";
import { Courses } from "@/components/sections/Courses";
import { About } from "@/components/sections/About";
import { WebCollab } from "@/components/sections/WebCollab";
import { Contact } from "@/components/sections/Contact";
import { MobileDock } from "@/components/navigation/MobileDock";
import { JsonLd } from "@/components/ui/JsonLd";
import { courses, lutPacks, projects } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * One continuous film, cut tight for phones:
 * black → hero (real-frame reel) → films → [desktop: lens] → LUT store →
 * courses → about + services → collaboration → contact → black.
 */
export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site.url}/#org`,
              name: site.brand,
              url: site.url,
              description: site.description,
              founder: { "@id": `${site.url}/#person` },
              sameAs: [site.social.instagram],
            },
            {
              "@type": "Person",
              "@id": `${site.url}/#person`,
              name: site.name,
              worksFor: { "@id": `${site.url}/#org` },
              jobTitle: "Cinematographer, Director & Colourist",
              url: site.url,
              sameAs: [site.social.instagram, site.social.youtube].filter(Boolean),
              address: { "@type": "PostalAddress", addressLocality: "Dehradun", addressCountry: "IN" },
              knowsAbout: ["Cinematography", "Colour grading", "Music videos", "Editing"],
            },
            ...projects.map((p) => ({
              "@type": "VideoObject",
              name: `${p.title} — ${p.artist}`,
              description: p.synopsis,
              thumbnailUrl: `${site.url}${p.cover.src}`,
              embedUrl: `https://www.youtube-nocookie.com/embed/${p.youtubeId}`,
              uploadDate: `${p.year}`,
              contributor: { "@type": "Person", name: site.name, roleName: p.role },
            })),
            ...lutPacks.map((p) => ({
              "@type": "Product",
              name: `${p.name} LUT pack`,
              description: p.description,
              url: `${site.url}/luts/${p.slug}`,
              brand: { "@type": "Brand", name: site.brand },
              offers: { "@type": "Offer", price: p.price, priceCurrency: site.currency, availability: "https://schema.org/InStock" },
            })),
            ...courses.map((c) => ({
              "@type": "Course",
              name: c.title,
              description: c.description,
              url: `${site.url}/courses/${c.slug}`,
              provider: { "@id": `${site.url}/#org` },
            })),
          ],
        }}
      />
      <Hero />
      <Work />
      <LensJourney />
      <LutStore />
      <Courses />
      <About />
      <WebCollab />
      <Contact />
      <MobileDock />
    </>
  );
}
