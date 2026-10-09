/**
 * Site-wide identity and contact config.
 * Anything set to `null` is hidden from the UI until filled in.
 */
export const site = {
  /** The brand — store, courses, site identity. */
  brand: "Prograde",
  brandUpper: "PROGRADE",
  /** The person behind it. */
  name: "Subodit Arya",
  shortName: "SUBODIT ARYA",
  handle: "cinematic_man.09",
  role: "Cinematographer",
  roles: ["Director", "Colourist"],
  tagline: "Visual stories crafted frame by frame.",
  description:
    "Prograde is the studio of Subodit Arya — a cinematographer, colourist and editor working between Dehradun and Mumbai — shooting music videos, brand films and commercials, and selling professional LUT packs and online colour grading courses.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://prograde.in",
  locations: ["Dehradun", "Mumbai"],
  basedIn: "Dehradun ⇄ Mumbai, India",

  social: {
    instagram: "https://www.instagram.com/cinematic_man.09/",
    // Instagram DM deep link — the fallback buying/booking channel.
    instagramDm: "https://ig.me/m/cinematic_man.09",
    youtube: null as string | null,
  },

  contact: {
    email: null as string | null,
    // Digits only, with country code, e.g. "919876543210".
    whatsapp: null as string | null,
  },

  /** The studio that designed & built this site — receives website inquiries. */
  webStudio: {
    name: "Amit Rawat",
    label: "Design & development",
    instagram: null as string | null,
    email: null as string | null,
  },

  currency: "INR",
} as const;

export function whatsappLink(text: string) {
  if (!site.contact.whatsapp) return null;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
