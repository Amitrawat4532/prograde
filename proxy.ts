import { NextResponse, type NextRequest } from "next/server";
import { courses, lutPacks, projects } from "@/lib/content";

/**
 * Detail pages stream inside <Suspense>, so a notFound() there can only send
 * 200 + noindex. Rejecting unknown slugs here gives crawlers a real 404.
 */
const known: Record<string, Set<string>> = {
  work: new Set(projects.map((p) => p.slug)),
  luts: new Set(lutPacks.map((p) => p.slug)),
  courses: new Set(courses.map((c) => c.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  if (known[section] && !known[section].has(slug)) {
    return NextResponse.rewrite(new URL("/__missing", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/work/:slug", "/luts/:slug", "/courses/:slug"],
};
