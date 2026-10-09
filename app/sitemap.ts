import type { MetadataRoute } from "next";
import { courses, lutPacks, projects } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), changeFrequency: "weekly", priority: 1 },
    ...lutPacks.map((p) => ({ url: u(`/luts/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.9 })),
    ...courses.map((c) => ({ url: u(`/courses/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: u(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
