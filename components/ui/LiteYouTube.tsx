"use client";

import Image from "next/image";
import { useState } from "react";

/** Poster first; the YouTube iframe (and its ~1MB of JS) loads only on click. */
export function LiteYouTube({ id, title, poster }: { id: string; title: string; poster: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="frame-marks relative aspect-video overflow-hidden bg-panel">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" data-cursor="Play" aria-label={`Play ${title}`}>
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            quality={70}
            className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
          <span aria-hidden className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/20" />
          <span aria-hidden className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/70 bg-black/30 text-ink">
            <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-ink" />
          </span>
          <span className="meta absolute bottom-5 left-5 text-ink">Watch the film</span>
        </button>
      )}
    </div>
  );
}
