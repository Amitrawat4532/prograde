"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { lockScroll } from "@/lib/scroll";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#luts", label: "LUTs" },
  { href: "/#courses", label: "Courses" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > 48;
        setCompact((c) => (c === next ? c : next));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const toggle = toggleRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const f = [toggle, ...menuRef.current.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      toggle?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      data-compact={compact}
      className="group/nav fixed inset-x-0 top-0 z-50 transition-[padding] duration-700 ease-[var(--ease-out)] px-[var(--gutter)] pt-5 data-[compact=true]:pt-3"
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-14 items-center justify-between gap-6 border border-transparent px-0 transition-[background-color,border-color,padding,height] duration-700 ease-[var(--ease-out)] group-data-[compact=true]/nav:h-12 group-data-[compact=true]/nav:border-line group-data-[compact=true]/nav:bg-black/80 group-data-[compact=true]/nav:px-4"
      >
        <Link href="/" className="relative z-10 flex items-baseline gap-3" aria-label={`${site.brand} — ${site.name}, home`} onClick={close}>
          <span className="text-[0.95rem] font-semibold tracking-[0.22em]">{site.brandUpper}</span>
          <span className="meta hidden text-muted transition-opacity duration-500 sm:inline group-data-[compact=true]/nav:opacity-0">
            by {site.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="meta link-u py-1 text-ink-2 transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="relative z-10 flex items-center gap-3">
          <Link href="/#luts" className="btn btn-solid hidden! h-10! px-4! sm:inline-flex!" onClick={close}>
            Shop LUTs
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="meta flex h-10 items-center gap-2 px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden className="relative block h-2.5 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-500 ${open ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 -z-10 flex flex-col justify-between bg-black px-[var(--gutter)] pb-10 pt-28 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden border-b border-line">
              <Link
                href={l.href}
                onClick={close}
                className="flex items-baseline justify-between py-4 text-[clamp(2.5rem,12vw,4.5rem)] font-semibold uppercase leading-none tracking-[-0.04em]"
              >
                {l.label}
                <span className="meta text-muted">0{i + 1}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-6">
          <Link href="/#luts" onClick={close} className="btn btn-amber w-full justify-center">
            Shop LUTs
          </Link>
          <div className="meta flex justify-between text-muted">
            <a href={site.social.instagram} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
            <span>{site.basedIn}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
