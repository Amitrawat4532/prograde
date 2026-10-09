import type { Grade } from "./grading";

/**
 * All site content lives here. Every image is a real frame from Subodit's own
 * released films (public/work/<slug>/1-3.jpg, taken at 25/50/75% of each video,
 * letterbox bars cropped). Films play from YouTube on click.
 */

/** `focus` = horizontal focal point (0–100) used when a wide frame is cropped tall on phones. */
export type Still = { src: string; alt: string; focus?: number };

const f = (slug: string, n: 1 | 2 | 3, alt: string, focus = 50): Still => ({
  src: `/work/${slug}/${n}.jpg`,
  alt,
  focus,
});

/* ------------------------------------------------------------------ */
/* Portfolio — real, credited releases                                  */
/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  title: string;
  artist: string;
  category: "Music Video" | "Cover Song" | "Teaser";
  year: number;
  label: string;
  role: string;
  logline: string;
  synopsis: string;
  youtubeId: string;
  cover: Still;
  stills: Still[];
  credits: { role: string; name: string }[];
};

export const projects: Project[] = [
  {
    slug: "maya-ju-lagi-re",
    title: "Maya Ju Lagi Re",
    artist: "Jay Snehi",
    category: "Music Video",
    year: 2026,
    label: "7hills music",
    role: "DOP · Edit · DI",
    logline: "A Garhwali love song in soft hill daylight, shot wide-open and graded warm.",
    synopsis:
      "Jay Snehi's song, featuring Viswash Rayal and Priyanshi Mamgain. Subodit shot, edited and graded the film — a 2.39 frame, shallow focus and gentle skin tones against Uttarakhand greens.",
    youtubeId: "D3LSL-xeILs",
    cover: f("maya-ju-lagi-re", 3, "Priyanshi Mamgain tucks a flower behind her ear in soft daylight", 58),
    stills: [
      f("maya-ju-lagi-re", 1, "A woman in a cream shawl smiles off-camera against a blurred hillside", 42),
      f("maya-ju-lagi-re", 2, "A woman smiles at a man in the foreground on a green hilltop", 52),
      f("maya-ju-lagi-re", 3, "A woman tucks a flower behind her ear, shallow depth of field", 58),
    ],
    credits: [
      { role: "Director & Producer", name: "Navodit Arya" },
      { role: "Singer · Lyrics · Composer", name: "Jay Snehi" },
      { role: "Featuring", name: "Viswash Rayal, Priyanshi Mamgain" },
      { role: "DOP · Edit · DI", name: "Subodit Arya" },
      { role: "Camera Assistant", name: "Anuj Arya" },
      { role: "Makeup", name: "Simriti" },
    ],
  },
  {
    slug: "mann-mohini",
    title: "Mann Mohini",
    artist: "Gaurav Raj",
    category: "Music Video",
    year: 2026,
    label: "7hills music",
    role: "DOP · Edit · DI",
    logline: "A Garhwali love song told through hillsides, wind and colour.",
    synopsis:
      "Gaurav Raj's song featuring Prashant Koranga and Priyanshi Mamgain, choreographed by Shubham Arya. Shot, edited and graded by Subodit across the hills of Uttarakhand.",
    youtubeId: "4KIVOWAygOA",
    cover: f("mann-mohini", 1, "Priyanshi Mamgain laughs in golden light in Mann Mohini", 46),
    stills: [
      f("mann-mohini", 1, "A woman laughs in golden light with hills behind her", 46),
      f("mann-mohini", 2, "A couple in a mustard sari and denim shirt on a hillside", 55),
      f("mann-mohini", 3, "A dancer throws a blue dupatta into the wind", 60),
    ],
    credits: [
      { role: "Director & Producer", name: "Navodit Arya" },
      { role: "DOP · Editor · DI", name: "Subodit Arya" },
      { role: "Singer", name: "Gaurav Raj" },
      { role: "Artists", name: "Prashant Koranga, Priyanshi Mamgain" },
      { role: "Lyrics", name: "Jay Snehi & Gaurav Taj" },
      { role: "Music / Mix & Master", name: "Ashwajeet Singh" },
      { role: "Assistant Director / Choreographer", name: "Shubham Arya" },
    ],
  },
  {
    slug: "kaafi-hai",
    title: "Kaafi Hai",
    artist: "MC Deep",
    category: "Music Video",
    year: 2024,
    label: "Gumnaam Kalakaar",
    role: "Director & Editor",
    logline: "Backlit silhouettes and last light for an independent hip-hop track.",
    synopsis:
      "MC Deep's track, produced by maxchris, with Aditi Gupta as the female lead. Subodit directed and edited the video — built almost entirely on backlight, flare and silhouette.",
    youtubeId: "K5gkZJhaZas",
    cover: f("kaafi-hai", 1, "Two silhouettes face each other against a hazy sunset in Kaafi Hai", 50),
    stills: [
      f("kaafi-hai", 1, "Two silhouettes against a hazy sunset", 50),
      f("kaafi-hai", 2, "A woman in yellow lit by golden backlight", 44),
      f("kaafi-hai", 3, "A man in a black hoodie walks beside a tree in dry grass", 46),
    ],
    credits: [
      { role: "Written & Performed", name: "MC Deep" },
      { role: "Music", name: "prod.maxchris" },
      { role: "Female Lead", name: "Aditi Gupta" },
      { role: "Directed & Edited", name: "Subodit Arya" },
    ],
  },
  {
    slug: "thoughts",
    title: "Thoughts",
    artist: "Kunal ft. Haze",
    category: "Music Video",
    year: 2024,
    label: "Kunal Rajput",
    role: "Director & Editor",
    logline: "Bamboo, shutters and warm grain — a one-location hip-hop video.",
    synopsis:
      "Kunal's track featuring and produced by Haze. Directed and edited by Subodit with a 2.39 frame, natural light and textured street locations.",
    youtubeId: "6u-qINku1OU",
    cover: f("thoughts", 3, "Kunal in a patterned jacket in front of a rolling shutter", 58),
    stills: [
      f("thoughts", 1, "A man stands on a road lined with bamboo", 55),
      f("thoughts", 2, "A man gestures to camera among bamboo", 52),
      f("thoughts", 3, "A man in a patterned jacket in front of a shutter", 58),
    ],
    credits: [
      { role: "Artist & Lyrics", name: "Kunal" },
      { role: "Featuring & Production", name: "Haze" },
      { role: "Mix & Master", name: "Syntax" },
      { role: "Directed & Edited", name: "Subodit Arya" },
    ],
  },
  {
    slug: "syali-mayali",
    title: "Syali Mayali",
    artist: "Jay Snehi & Shivani Negi",
    category: "Music Video",
    year: 2023,
    label: "7hills music",
    role: "DOP & Editor",
    logline: "Village celebration, pine forests and a cast of the whole community.",
    synopsis:
      "Featuring Sanju Silodi and Jyoti Arya, with group dancers and the Mahila Mangal Dal of Duptoli. Shot and edited by Subodit among pine forests and village courtyards.",
    youtubeId: "gvC382eeVpI",
    cover: f("syali-mayali", 2, "Jyoti Arya smiles in a pink outfit among pine trees", 54),
    stills: [
      f("syali-mayali", 1, "Women in traditional dress laugh together in a courtyard", 45),
      f("syali-mayali", 2, "A woman in pink stands among pine trees", 54),
      f("syali-mayali", 3, "A couple laughs together in a dry field", 50),
    ],
    credits: [
      { role: "Featuring", name: "Sanju Silodi & Jyoti Arya" },
      { role: "Singers", name: "Jay Snehi & Shivani Negi" },
      { role: "Producer & Director", name: "Navodit Shankar Arya" },
      { role: "DOP & Video Editor", name: "Subodit Shankar Arya" },
      { role: "Music & Mix", name: "Hilly Vibe Studio" },
      { role: "Makeup", name: "Anjali Negi" },
    ],
  },
  {
    slug: "buransi-phool-si",
    title: "Buransi Phool Si",
    artist: "Jay Snehi & Shivani Negi",
    category: "Teaser",
    year: 2026,
    label: "7hills music",
    role: "DOP & Editor",
    logline: "A road-trip romance through hill towns, in teaser form.",
    synopsis:
      "Featuring Prachi Panwar and Prashant Koranga, with lyrics by Shree Mahipal Snehi and music by Ashwajeet Singh. Shot and edited by Subodit.",
    youtubeId: "eWuFK8zXBv8",
    cover: f("buransi-phool-si", 3, "Prachi Panwar smiles from a car window", 40),
    stills: [
      f("buransi-phool-si", 1, "A man smiles outside a hill-town shop", 45),
      f("buransi-phool-si", 2, "A man spins a woman beside a white car on a hill road", 50),
      f("buransi-phool-si", 3, "A woman smiles from a car window", 40),
    ],
    credits: [
      { role: "Featuring", name: "Prachi Panwar, Prashant Koranga" },
      { role: "Singers", name: "Jay Snehi, Shivani Negi" },
      { role: "Producer & Director", name: "Navodit Arya" },
      { role: "Lyrics", name: "Shree Mahipal Snehi" },
      { role: "Music", name: "Ashwajeet Singh" },
      { role: "DOP & Editor", name: "Subodit Arya" },
    ],
  },
  {
    slug: "chitthi",
    title: "Chitthi",
    artist: "Jay Snehi & Navita Arya",
    category: "Cover Song",
    year: 2024,
    label: "7hills music",
    role: "DOP & Editor",
    logline: "Monsoon roads, an umbrella and a letter that never arrives.",
    synopsis:
      "A cover featuring Neeraj Bhandari and Saniya Danu, with music by K9 Studio. Shot and edited by Subodit on wet monsoon roads.",
    youtubeId: "FqeRfc6nG80",
    cover: f("chitthi", 3, "A woman with a lilac umbrella meets a man on a wet road", 50),
    stills: [
      f("chitthi", 1, "A man in sunglasses dances on a road beside a woman in pink", 55),
      f("chitthi", 2, "A man in sunglasses and a blue shirt on a tree-lined road", 50),
      f("chitthi", 3, "A woman with a lilac umbrella on a wet road", 50),
    ],
    credits: [
      { role: "Produced & Directed", name: "Navodit Arya" },
      { role: "Editor & DOP", name: "Subodit Arya" },
      { role: "Singers", name: "Jay Snehi, Navita Arya" },
      { role: "Actors", name: "Neeraj Bhandari, Saniya Danu" },
      { role: "Music & Mix", name: "K9 Studio — Vijay Pal" },
    ],
  },
  {
    slug: "kakh-dheki-wholi",
    title: "Kakh Dheki Wholi",
    artist: "Gaurav Gauri",
    category: "Cover Song",
    year: 2024,
    label: "7hills music",
    role: "DOP & Editor",
    logline: "A tribute cover to Narendra Singh Negi, shot by the river bridge.",
    synopsis:
      "Gaurav Gauri sings and stars opposite Simran Bisht in a cover dedicated to Narendra Singh Negi. Shot and edited by Subodit.",
    youtubeId: "LfRy7jzzwNQ",
    cover: f("kakh-dheki-wholi", 3, "Simran Bisht smiles in a field in a patterned shawl", 44),
    stills: [
      f("kakh-dheki-wholi", 1, "A man adjusts his hair on a green hillside", 55),
      f("kakh-dheki-wholi", 2, "Friends pose on a steel bridge", 55),
      f("kakh-dheki-wholi", 3, "A woman in a patterned shawl in a field", 44),
    ],
    credits: [
      { role: "Produced & Directed", name: "Navodit Arya" },
      { role: "Editor & DOP", name: "Subodit Arya" },
      { role: "Singer & Actor", name: "Gaurav Gauri" },
      { role: "Actor", name: "Simran Bisht" },
      { role: "Music & Mix", name: "K9 Studio — Vijay Pal" },
    ],
  },
  {
    slug: "suwa-teri-yaadon-ma",
    title: "Suwa Teri Yaadon Ma",
    artist: "Neeraj Bhandari & Anjali Arya",
    category: "Cover Song",
    year: 2024,
    label: "7hills music",
    role: "DOP & Editor",
    logline: "A small, warm love story in a 4:3 frame.",
    synopsis:
      "A cover featuring Neeraj Bhandari and Anjali Arya, with Jay Snehi as assistant director. Shot and edited by Subodit in a classic 4:3 frame.",
    youtubeId: "IpwX2Wxpl_0",
    cover: f("suwa-teri-yaadon-ma", 1, "Anjali Arya touches her hair, bangles catching the light", 45),
    stills: [
      f("suwa-teri-yaadon-ma", 1, "A woman touches her hair, bangles catching the light", 45),
      f("suwa-teri-yaadon-ma", 2, "A couple walks arm in arm on a bridge", 50),
      f("suwa-teri-yaadon-ma", 3, "A man in glasses smiles in a sunlit room", 55),
    ],
    credits: [
      { role: "Produced & Directed", name: "Navodit Arya" },
      { role: "Featuring", name: "Neeraj Bhandari, Anjali Arya" },
      { role: "DOP & Editor", name: "Subodit Arya" },
      { role: "Assistant Director", name: "Jay Snehi" },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** The hero "reel" — crossfading real frames. */
export const heroReel: Still[] = [
  f("maya-ju-lagi-re", 3, "A woman tucks a flower behind her ear — Maya Ju Lagi Re", 58),
  f("mann-mohini", 3, "A dancer throws a blue dupatta into the wind — Mann Mohini", 60),
  f("thoughts", 3, "Kunal in front of a rolling shutter — Thoughts", 58),
  f("kaafi-hai", 2, "A woman in golden backlight — Kaafi Hai", 44),
]

export const media = {
  about: f("kaafi-hai", 1, "Two silhouettes against a hazy sunset — from Kaafi Hai, directed by Subodit", 50),
} satisfies Record<string, Still>;

/* ------------------------------------------------------------------ */
/* LUT packs                                                            */
/* ------------------------------------------------------------------ */

export type LutPack = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  count: number;
  price: number;
  compareAt?: number;
  image: Still;
  grade: Grade;
  swatch: string[];
  bestFor: string[];
  software: string[];
  cameras: string[];
  formats: string[];
  /** Hosted checkout (Razorpay / Gumroad / Lemon Squeezy…). Null → order request flow. */
  checkoutUrl: string | null;
};

const SOFTWARE = ["DaVinci Resolve", "Premiere Pro", "Final Cut Pro", "After Effects", "CapCut (desktop)", "LumaFusion"];
const CAMERAS = ["Sony S-Log3 / S-Gamut3.Cine", "Canon C-Log3", "Panasonic V-Log", "Fujifilm F-Log", "Rec.709 (phone & standard profiles)"];
const FORMATS = [".cube (33-point)", "PDF install guide"];

export const lutPacks: LutPack[] = [
  {
    slug: "himalayan-mist",
    name: "Himalayan Mist",
    subtitle: "Soft greens. Cool air. Honest skin.",
    description:
      "Built in the hills of Uttarakhand for overcast, diffused light. Restrained greens, cool lifted shadows and creamy highlights that never go digital.",
    count: 12,
    price: 749,
    compareAt: 1499,
    image: f("mann-mohini", 2, "A couple on a hillside from Mann Mohini", 55),
    grade: {
      exposure: 1.02,
      contrast: 0.96,
      saturation: 0.82,
      lift: [0.0, 0.025, 0.04],
      gain: [1.03, 1.0, 0.95],
      shadowTint: [-0.01, 0.02, 0.035],
      highlightTint: [0.03, 0.015, -0.02],
      fade: 0.04,
    },
    swatch: ["#1d2a2a", "#4f6359", "#a9b39d", "#e7e1cf"],
    bestFor: ["Travel films", "Mountain & nature", "Overcast exteriors"],
    software: SOFTWARE,
    cameras: CAMERAS,
    formats: FORMATS,
    checkoutUrl: null,
  },
  {
    slug: "monsoon-noir",
    name: "Monsoon Noir",
    subtitle: "Deep teal shadows. Wet highlights.",
    description:
      "A moody night look for city work and commercials. Dense blacks, teal shadow separation and warm practicals — tuned to hold skin tones under mixed light.",
    count: 10,
    price: 749,
    compareAt: 1499,
    image: f("chitthi", 3, "A woman with an umbrella on a wet monsoon road from Chitthi", 50),
    grade: {
      exposure: 0.98,
      contrast: 1.22,
      saturation: 0.86,
      lift: [-0.015, 0.02, 0.04],
      gain: [1.06, 1.0, 0.92],
      shadowTint: [-0.03, 0.03, 0.06],
      highlightTint: [0.06, 0.025, -0.04],
      fade: 0.015,
    },
    swatch: ["#071417", "#183a40", "#b07b4f", "#f0d2a8"],
    bestFor: ["Night exteriors", "Automotive", "Music videos"],
    software: SOFTWARE,
    cameras: CAMERAS,
    formats: FORMATS,
    checkoutUrl: null,
  },
  {
    slug: "amber-reel",
    name: "Amber Reel",
    subtitle: "Warm film emulation for faces.",
    description:
      "A 35mm-inspired print look with golden mids, soft roll-off and gentle halation-like warmth. Designed first for portraits, weddings and fashion.",
    count: 15,
    price: 899,
    compareAt: 1799,
    image: f("kaafi-hai", 2, "A woman in golden backlight from Kaafi Hai", 44),
    grade: {
      exposure: 1.03,
      contrast: 1.06,
      saturation: 1.02,
      lift: [0.02, 0.012, 0.0],
      gain: [1.05, 1.0, 0.9],
      shadowTint: [0.0, 0.012, -0.01],
      highlightTint: [0.06, 0.03, -0.045],
      fade: 0.05,
    },
    swatch: ["#2a1a12", "#7a4b32", "#d39a6a", "#f4dcc0"],
    bestFor: ["Portraits", "Fashion", "Weddings"],
    software: SOFTWARE,
    cameras: CAMERAS,
    formats: FORMATS,
    checkoutUrl: null,
  },
  {
    slug: "storyreel",
    name: "Storyreel",
    subtitle: "Punchy, scroll-stopping colour.",
    description:
      "The look behind the reels. Rich contrast and a confident teal-orange split that survives Instagram compression and phone screens.",
    count: 20,
    price: 999,
    compareAt: 1999,
    image: f("kakh-dheki-wholi", 2, "Friends posing on a steel bridge from Kakh Dheki Wholi", 55),
    grade: {
      exposure: 1.04,
      contrast: 1.16,
      saturation: 1.22,
      lift: [-0.01, 0.01, 0.03],
      gain: [1.06, 1.0, 0.94],
      shadowTint: [-0.025, 0.02, 0.05],
      highlightTint: [0.05, 0.02, -0.03],
      fade: 0.0,
    },
    swatch: ["#0c1c26", "#245466", "#e07a3e", "#f7c88c"],
    bestFor: ["Instagram reels", "Vlogs & travel", "Phone footage"],
    software: SOFTWARE,
    cameras: CAMERAS,
    formats: FORMATS,
    checkoutUrl: null,
  },
];

export const lutBundle = {
  slug: "complete-collection",
  name: "The Prograde Collection",
  count: lutPacks.reduce((n, p) => n + p.count, 0),
  price: 2499,
  compareAt: lutPacks.reduce((n, p) => n + (p.compareAt ?? p.price), 0),
  checkoutUrl: null as string | null,
};

export const getLutPack = (slug: string) => lutPacks.find((p) => p.slug === slug);

export const lutInstallSteps: Record<string, string[]> = {
  "DaVinci Resolve": [
    "Project Settings → Color Management → Open LUT Folder.",
    "Copy the .cube files into that folder, then click Update Lists.",
    "In the Color page, right-click a node → LUT → choose the pack.",
  ],
  "Premiere Pro": [
    "Open the Lumetri Color panel on your clip.",
    "Basic Correction → Input LUT → Browse, and pick a LOG LUT; or Creative → Look for Rec.709.",
    "Adjust Intensity to taste.",
  ],
  "Final Cut Pro": [
    "Effects browser → Color → drag Custom LUT onto the clip.",
    "In the Inspector, LUT → Choose Custom LUT and select the .cube file.",
    "Set the input colour space to match your camera profile.",
  ],
};

/* ------------------------------------------------------------------ */
/* Courses                                                              */
/* ------------------------------------------------------------------ */

export type Course = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  lessons: number;
  duration: string;
  level: string;
  price: number;
  compareAt?: number;
  image: Still;
  outcomes: string[];
  modules: { title: string; lessons: string[] }[];
  format: string;
  checkoutUrl: string | null;
};

export const courses: Course[] = [
  {
    slug: "colour-grading",
    title: "Colour Grading",
    kicker: "Live online class",
    description:
      "The online grading class — from LOG footage to a finished, signature look in DaVinci Resolve. Node trees, skin, contrast and building your own LUTs.",
    lessons: 24,
    duration: "9 hrs",
    level: "Beginner → Advanced",
    price: 4999,
    compareAt: 7999,
    image: f("syali-mayali", 3, "A graded frame from Syali Mayali — a couple laughing in a dry field", 50),
    outcomes: [
      "Read scopes and balance any shot in minutes",
      "Build a repeatable node tree for every project",
      "Grade skin tones that hold up on any screen",
      "Design and export your own .cube LUTs",
    ],
    modules: [
      { title: "Foundations", lessons: ["Colour science without the maths", "LOG, gamma & colour spaces", "Reading scopes"] },
      { title: "The node tree", lessons: ["Primary balance", "Contrast & the S-curve", "Qualifiers & windows"] },
      { title: "Looks", lessons: ["Teal & orange done right", "Film emulation", "Building a LUT"] },
      { title: "Delivery", lessons: ["Matching a sequence", "Export for Instagram & YouTube", "Client review workflow"] },
    ],
    format: "Live sessions + lifetime recordings",
    checkoutUrl: null,
  },
  {
    slug: "cinematography-masterclass",
    title: "Cinematography Masterclass",
    kicker: "Flagship course",
    description:
      "Camera, composition and movement — how to make every frame feel intentional, from music videos to brand films.",
    lessons: 32,
    duration: "12 hrs",
    level: "Intermediate",
    price: 6999,
    compareAt: 9999,
    image: f("thoughts", 2, "A 2.39 frame from Thoughts, directed by Subodit", 52),
    outcomes: [
      "Choose lenses and focal lengths with purpose",
      "Compose for emotion, not just the rule of thirds",
      "Plan camera movement that serves the story",
      "Run a shoot day like a working DOP",
    ],
    modules: [
      { title: "The camera", lessons: ["Exposure triangle for video", "Shutter, frame rate & motion", "Picture profiles"] },
      { title: "The frame", lessons: ["Composition & negative space", "Lens language", "Aspect ratios"] },
      { title: "Movement", lessons: ["Handheld vs gimbal", "Motivated moves", "Shot lists & coverage"] },
      { title: "On set", lessons: ["Working with directors", "Music-video workflow", "Brand shoot workflow"] },
    ],
    format: "On-demand video + project feedback",
    checkoutUrl: null,
  },
  {
    slug: "lighting-for-cinema",
    title: "Lighting for Cinema",
    kicker: "Craft course",
    description:
      "Shape light like a cinematographer — with big sources, small budgets and whatever the location gives you.",
    lessons: 18,
    duration: "6 hrs",
    level: "Intermediate",
    price: 3999,
    image: f("kaafi-hai", 3, "Natural backlight in a frame from Kaafi Hai", 46),
    outcomes: [
      "Light faces with one, two and three sources",
      "Use practicals and negative fill",
      "Match daylight and tungsten",
      "Light night exteriors on a budget",
    ],
    modules: [
      { title: "Quality of light", lessons: ["Hard vs soft", "Direction & ratio", "Colour temperature"] },
      { title: "Setups", lessons: ["One-light portrait", "Classic three-point", "Motivated lighting"] },
      { title: "Locations", lessons: ["Daylight interiors", "Night exteriors", "Practicals & haze"] },
    ],
    format: "On-demand video",
    checkoutUrl: null,
  },
  {
    slug: "visual-storytelling",
    title: "Visual Storytelling",
    kicker: "Short course",
    description:
      "Turning ideas into images — treatments, mood boards, shot design and editing for rhythm.",
    lessons: 14,
    duration: "5 hrs",
    level: "All levels",
    price: 2499,
    image: f("suwa-teri-yaadon-ma", 2, "A couple on a bridge from Suwa Teri Yaadon Ma", 50),
    outcomes: [
      "Write a one-page treatment",
      "Build a mood board that sells the idea",
      "Design shots around emotion",
      "Edit for rhythm and pace",
    ],
    modules: [
      { title: "Idea", lessons: ["Finding the story", "Treatments", "Mood boards"] },
      { title: "Image", lessons: ["Shot design", "Colour as emotion", "Sound & silence"] },
      { title: "Rhythm", lessons: ["Editing for pace", "Reels vs long form"] },
    ],
    format: "On-demand video",
    checkoutUrl: null,
  },
];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

/* ------------------------------------------------------------------ */
/* About & services                                                     */
/* ------------------------------------------------------------------ */

export const about = {
  intro:
    "Subodit Arya grew up between the ridgelines of Uttarakhand, and it shows: his frames are patient, his light is soft, and his colour never shouts. He works between Dehradun and Mumbai as a cinematographer, editor and colourist.",
  body: "On most of his films he shoots, cuts and grades — DOP, edit and DI — so the look is designed on set, not rescued in post. The same eye goes into every LUT pack and every class he teaches.",
  // Public figures: Instagram followers, credited releases on YouTube (2023–2026) and their combined views (Oct 2026).
  stats: [
    { value: "18.9K", label: "Instagram community" },
    { value: `${projects.length}`, label: "Credited releases" },
    { value: "49K+", label: "Views on released films" },
    { value: "3-in-1", label: "DOP · Edit · DI" },
  ],
  collaborators: ["7hills music", "Navodit Arya", "Jay Snehi", "MC Deep", "Kunal & Haze", "Gumnaam Kalakaar"],
  locations: ["Dehradun", "Mumbai", "Nepal", "Harshil", "Chennai", "Bangalore"],
};

/** Compact list — the booking form carries the detail. */
export const services = [
  { title: "Music Videos", description: "Performance & narrative, lit and moved with the track." },
  { title: "Cinematography", description: "DOP for hire, with or without a camera package." },
  { title: "Colour Grading", description: "Remote DI in DaVinci Resolve for films, reels and ads." },
  { title: "Editing", description: "From rushes to final cut, paced for the platform." },
  { title: "Directing", description: "Concept, treatment and on-set direction for short-form." },
  { title: "Brand & Commercial", description: "Product and brand films for every screen size." },
];
