# Subodit Arya — Cinematographer, Director & Colourist

A cinematic portfolio, LUT store and course site for [@cinematic_man.09](https://www.instagram.com/cinematic_man.09/).
Built with Next.js 16 (App Router, Cache Components), Tailwind CSS 4, React Three Fiber, GSAP ScrollTrigger and Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## The film, section by section

Mobile-first: ~90% of visitors are on phones, so every section is designed at 375px first and expanded for desktop.

| # | Section | Component | Phone | Desktop |
|---|---------|-----------|-------|---------|
| — | Hero | `sections/Hero.tsx` | Widescreen reel band + name, 2 CTAs, "new release" play chip | Full-bleed reel, letterbox-close scroll transition |
| 01 | Selected work | `sections/Work.tsx`, `portfolio/ProjectCard.tsx` | Featured film + swipe rail | Featured + rail with arrows |
| 02 | The lens | `sections/LensJourney.tsx` | *(skipped)* | Scroll-driven 3D lens |
| 03 | LUT store | `sections/LutStore.tsx`, `products/*` | Tall before/after, pack tabs, swipe rail | Wide comparator + 4-up grid |
| 04 | Courses | `sections/Courses.tsx` | Swipe rail | 4-up grid with tilt |
| 05 | About + services | `sections/About.tsx` | Compact bio, stats, 2-col services | Sticky still |
| 06 | Collaboration | `sections/WebCollab.tsx` | Compact | Browser frame tilts upright |
| 07 | Contact | `sections/Contact.tsx` | CTAs first | — |

A floating dock (`navigation/MobileDock.tsx`) gives phones "Book a shoot" / "Shop LUTs" after the hero.
Films play in one shared player (`ui/FilmPlayer.tsx`) — YouTube loads only when a film is opened.

Detail routes (all statically prerendered): `/work/[slug]`, `/luts/[slug]`, `/courses/[slug]`.

## Editing content

- **`lib/site.ts`** — name, socials, email, WhatsApp, web-studio credit. Fields set to `null` are hidden.
- **`lib/content.ts`** — films, hero reel, LUT packs, courses, about, services.

### Films & images (all real)

The portfolio is Subodit's nine credited releases on YouTube (credits copied from each video's description).
Every image on the site is a real frame from those films, stored in `public/work/<slug>/1-3.jpg`
(frames at 25/50/75% of each video, 1280×720, letterbox bars cropped).

To add a film: add an entry to `projects` in `lib/content.ts` with its `youtubeId`, and drop three frames into
`public/work/<slug>/`. `focus` (0–100) sets the horizontal focal point used when a wide frame is cropped tall.

**Want sharper images?** YouTube frames top out at 720p. Exporting stills from the original masters
(e.g. 2400px JPGs) into the same paths will make everything crisper, especially full-bleed on desktop.
On phones, hero and title images are deliberately shown as widescreen bands so 720p stays sharp.

### LUT previews

Each pack has a `grade` in `lib/content.ts`. The before/after slider runs that grade over a real frame once,
on a canvas (`lib/grading.ts`). Tune the numbers to match each real `.cube` file.

## Selling: checkout & inquiries

There is no payment processor in the project yet. Two ways to sell:

1. **Hosted checkout (recommended)** — set `checkoutUrl` on a LUT pack, the bundle or a course in `lib/content.ts`
   (Razorpay Payment Page, Gumroad, Lemon Squeezy, Cosmofeed…). The Buy button then goes straight there.
2. **Order request (default)** — with `checkoutUrl: null`, Buy opens a short form handled by the Server Action in
   `app/actions.ts`. Configure delivery in `.env.local` (see `.env.example`):

   - `INQUIRY_WEBHOOK_URL` and/or `INQUIRY_EMAIL` + `RESEND_API_KEY` → orders, course seats, bookings, contact
   - `WEB_INQUIRY_WEBHOOK_URL` and/or `WEB_INQUIRY_EMAIL` → "Build my website" leads (go to the web studio, not Subodit)

   If nothing is configured, the form never pretends to send: it shows the prepared message with **Copy**,
   **Instagram DM**, and (if set in `lib/site.ts`) **WhatsApp** / **Email** buttons.

## Performance notes

- Three.js loads only via `next/dynamic({ ssr: false })`, only on desktop, and only ~1 screen before the lens
  section. Phones never download it.
- Each canvas uses `frameloop="never"` while off-screen. Lighting is an env-map baked once (`frames={1}`); no HDR downloads.
- The lens is procedural; the barrel is a single merged geometry (one draw call). One small dust particle system, desktop only.
- Phones/tablets: no WebGL, no smooth-scroll library, no pinned sections, native swipe rails only.
- Reveals use one shared `IntersectionObserver` + CSS transitions. Grain is one static SVG noise tile moved with `steps()`.
- Lenis smooth scroll runs only for fine pointers without reduced motion; touch devices keep native scrolling.
- `prefers-reduced-motion`: no intro, no pinning, no WebGL, no smooth scroll — all content visible.

## Styling note

Component classes (`.btn`, `.meta`, `.eyebrow`, `.display`…) in `app/globals.css` are unlayered, so they beat
Tailwind utilities. When a utility must override one of them, use Tailwind's important suffix, e.g. `btn h-11!`
or `meta text-[0.6rem]!`.
