import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Nav } from "@/components/navigation/Nav";
import { Cursor } from "@/components/ui/Cursor";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { Footer } from "@/components/sections/Footer";
import { InlineScript } from "@/components/ui/InlineScript";
import { FilmPlayer } from "@/components/ui/FilmPlayer";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} — ${site.name}, Cinematographer & Colourist`,
    template: `%s — ${site.brand}`,
  },
  description: site.description,
  keywords: [
    "Prograde",
    "Prograde LUTs",
    "Subodit Arya",
    "cinematographer Dehradun",
    "cinematographer Mumbai",
    "colourist",
    "LUT pack",
    "colour grading course",
    "DaVinci Resolve LUTs",
    "music video DOP",
  ],
  authors: [{ name: site.name, url: site.social.instagram }],
  openGraph: {
    type: "website",
    siteName: site.brand,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

/**
 * Marks the document as JS-enabled before first paint so reveal states can be
 * hidden without a flash. If hydration never happens (script error, very slow
 * network), the class is removed after 5s so no content stays hidden.
 */
const bootScript = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.dataset.hydrated)d.classList.remove('js')},5000)})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} antialiased`}
    >
      <head>
        <InlineScript html={bootScript} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <div className="grain-wrap" aria-hidden>
          <div className="grain" />
        </div>
        <FilmPlayer />
        <Cursor />
        <MotionProvider />
      </body>
    </html>
  );
}
