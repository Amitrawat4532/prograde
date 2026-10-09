"use client";

import { useEffect, useRef, useState } from "react";
import { lockScroll } from "@/lib/scroll";

type Film = { id: string; title: string };

const EVENT = "play-film";

/** Opens the shared player from anywhere. */
export function playFilm(film: Film) {
  window.dispatchEvent(new CustomEvent<Film>(EVENT, { detail: film }));
}

/**
 * One player for the whole site, mounted once in the layout. YouTube's iframe
 * (and its ~1MB of JS) is only created when a film is opened.
 */
export function FilmPlayer() {
  const ref = useRef<HTMLDialogElement>(null);
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    const onPlay = (e: Event) => setFilm((e as CustomEvent<Film>).detail);
    window.addEventListener(EVENT, onPlay);
    return () => window.removeEventListener(EVENT, onPlay);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d || !film) return;
    if (!d.open) d.showModal();
    lockScroll(true);
    return () => lockScroll(false);
  }, [film]);

  return (
    <dialog
      ref={ref}
      onClose={() => setFilm(null)}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      aria-label={film ? `Playing ${film.title}` : "Film player"}
      className="m-auto h-full max-h-none w-full max-w-none bg-black/95 p-0 text-ink backdrop:bg-black/80"
    >
      {film && (
        <div className="flex h-full flex-col justify-center px-0 sm:px-[var(--gutter)]">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 pb-3 sm:px-0">
            <p className="meta truncate text-ink-2">
              <span className="rec mr-2 align-middle" aria-hidden /> {film.title}
            </p>
            <button type="button" onClick={() => ref.current?.close()} className="meta h-11 shrink-0 px-2 text-ink" autoFocus>
              Close ✕
            </button>
          </div>
          <div className="mx-auto aspect-video w-full max-w-6xl bg-panel">
            <iframe
              key={film.id}
              src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={film.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}

/** Small play trigger usable inside server components. */
export function PlayFilmButton({
  id,
  title,
  label = "Play film",
  className = "",
}: {
  id: string;
  title: string;
  label?: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => playFilm({ id, title })} className={className} data-cursor="Play" aria-label={`Play ${title}`}>
      <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/70 bg-black/40">
        <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-ink" />
      </span>
      {label && <span className="meta">{label}</span>}
    </button>
  );
}
