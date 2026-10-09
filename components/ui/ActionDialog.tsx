"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { lockScroll } from "@/lib/scroll";
import { InquiryForm } from "./InquiryForm";
import type { InquiryKind } from "@/app/actions";

type Props = {
  /** Trigger button content */
  label: ReactNode;
  className?: string;
  cursor?: string;
  title: string;
  intro?: ReactNode;
  kind: InquiryKind;
  variant?: "order" | "booking" | "website";
  item?: string;
  price?: string;
  submitLabel: string;
};

/** Native <dialog>: focus trapping, Esc and inert background come for free. */
export function ActionDialog({ label, className = "btn", cursor, title, intro, ...form }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lockScroll(true);
    }
    return () => {
      if (open) lockScroll(false);
    };
  }, [open]);

  return (
    <>
      <button type="button" className={className} data-cursor={cursor} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {label}
      </button>
      {open && (
        <dialog
          ref={ref}
          onClose={() => setOpen(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) ref.current?.close();
          }}
          aria-labelledby="dialog-title"
          className="m-0 ml-auto h-full max-h-none w-full max-w-xl overflow-y-auto border-l border-line bg-[#0a0a09] p-0 text-ink backdrop:bg-black/70 open:animate-[sheet_0.7s_var(--ease-out)]"
        >
          <div className="flex min-h-full flex-col px-6 pb-10 pt-6 sm:px-10">
            <div className="mb-12 flex items-center justify-between">
              <p className="meta text-muted">
                <span className="rec mr-2 align-middle" aria-hidden /> {form.kind === "website" ? "New project" : "Request"}
              </p>
              <button type="button" onClick={() => ref.current?.close()} className="meta link-u text-ink-2 hover:text-ink">
                Close ✕
              </button>
            </div>
            <h2 id="dialog-title" className="display text-[clamp(2.2rem,6vw,3.6rem)]">
              {title}
            </h2>
            {intro && <div className="mt-5 text-ink-2">{intro}</div>}
            <div className="mt-10">
              <InquiryForm {...form} />
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
