import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-[var(--gutter)] text-center">
      <p className="meta flex items-center gap-3 text-muted">
        <span className="rec" aria-hidden /> Frame missing — 404
      </p>
      <h1 className="display mt-6 text-[clamp(3rem,12vw,10rem)]">
        Cut <span className="serif italic normal-case tracking-normal text-ink-2">to</span> black.
      </h1>
      <p className="mt-6 max-w-md text-ink-2">This shot didn&rsquo;t make the final edit.</p>
      <Link href="/" className="btn btn-solid mt-10">
        Back to the opening scene
      </Link>
    </section>
  );
}
