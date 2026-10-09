"use client";

/**
 * Runs during HTML parsing on hard loads; inert (text/plain) when React renders
 * it on the client, which avoids React's dev warning about <script> tags.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
