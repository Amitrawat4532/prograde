"use client";

import { useActionState, useId, useState } from "react";
import { sendInquiry, type InquiryKind, type InquiryState } from "@/app/actions";
import { site, whatsappLink } from "@/lib/site";

type Props = {
  kind: InquiryKind;
  item?: string;
  price?: string;
  submitLabel: string;
  /** Show service / budget / scope fields */
  variant?: "order" | "booking" | "website";
};

const initial: InquiryState = { status: "idle" };

const SERVICES = ["Music video", "Brand film", "Commercial", "Documentary", "Colour grading only", "Other"];
const BUDGETS = ["Under ₹50k", "₹50k – ₹1.5L", "₹1.5L – ₹5L", "₹5L+", "Not sure yet"];
const SCOPE = ["Premium web design", "3D / interactive", "Shopify", "WordPress", "Next.js", "Performance"];

function Field({
  label,
  error,
  children,
  id,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-xs text-[#e08a7f]">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-amber focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-[#e08a7f]";

/** Direct channels shown when the form can't deliver by itself. */
function Fallback({ summary, kind }: { summary: string; kind: InquiryKind }) {
  const [copied, setCopied] = useState(false);
  const web = kind === "website";
  const email = web ? site.webStudio.email : site.contact.email;
  const ig = web ? site.webStudio.instagram : site.social.instagramDm;
  const wa = web ? null : whatsappLink(summary);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {}
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-ink-2">
        Send this directly and you&rsquo;ll get a reply within a day:
      </p>
      <pre className="max-h-40 overflow-auto whitespace-pre-wrap border border-line bg-panel p-4 font-mono text-xs leading-relaxed text-ink-2">
        {summary}
      </pre>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} className="btn h-11!">
          {copied ? "Copied ✓" : "Copy message"}
        </button>
        {ig && (
          <a href={ig} target="_blank" rel="noreferrer" onClick={copy} className="btn btn-solid h-11!">
            Instagram DM ↗
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noreferrer" className="btn h-11!">
            WhatsApp ↗
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(summary.split("\n")[0])}&body=${encodeURIComponent(summary)}`}
            className="btn h-11!"
          >
            Email ↗
          </a>
        )}
      </div>
    </div>
  );
}

export function InquiryForm({ kind, item, price, submitLabel, variant }: Props) {
  const [state, action, pending] = useActionState(sendInquiry, initial);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const v = state.values ?? {};

  if (state.status === "ok") {
    return (
      <div role="status" className="flex flex-col gap-3 py-6">
        <p className="meta text-amber">Received</p>
        <p className="text-2xl font-medium tracking-[-0.02em]">
          Thank you — {kind === "website" ? "I'll" : "we'll"} be in touch within 24 hours.
        </p>
        {kind === "order" && (
          <p className="text-sm text-ink-2">You&rsquo;ll receive a secure payment link by email, followed by your download.</p>
        )}
      </div>
    );
  }

  if (state.status === "unconfigured" && state.summary) {
    return <Fallback summary={state.summary} kind={kind} />;
  }

  return (
    <form action={action} className="flex flex-col gap-7" noValidate>
      <input type="hidden" name="kind" value={kind} />
      {item && <input type="hidden" name="item" value={item} />}
      {price && <input type="hidden" name="price" value={price} />}
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company URL <input name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Name" id={id("name")} error={state.errors?.name}>
          <input
            id={id("name")}
            name="name"
            defaultValue={v.name}
            autoComplete="name"
            required
            className={inputCls}
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? `${id("name")}-err` : undefined}
          />
        </Field>
        <Field label="Email" id={id("email")} error={state.errors?.email}>
          <input
            id={id("email")}
            name="email"
            defaultValue={v.email}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            className={inputCls}
            aria-invalid={!!state.errors?.email}
            aria-describedby={state.errors?.email ? `${id("email")}-err` : undefined}
          />
        </Field>
      </div>

      {variant === "order" && (
        <Field label="Phone / WhatsApp (optional)" id={id("phone")}>
          <input id={id("phone")} name="phone" defaultValue={v.phone} type="tel" autoComplete="tel" className={inputCls} />
        </Field>
      )}

      {variant === "booking" && (
        <Field label="Service" id={id("service")}>
          <select id={id("service")} name="service" className={`${inputCls} [&>option]:bg-black`} defaultValue={v.service || SERVICES[0]}>
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      )}

      {variant === "website" && (
        <>
          <Field label="Brand / current website" id={id("brand")}>
            <input id={id("brand")} name="brand" defaultValue={v.brand} placeholder="yourbrand.com or @handle" className={inputCls} />
          </Field>
          <fieldset className="flex flex-col gap-3">
            <legend className="eyebrow mb-3">What do you need?</legend>
            <div className="flex flex-wrap gap-2">
              {SCOPE.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input type="checkbox" name="scope" value={s} className="peer sr-only" />
                  <span className="meta inline-block border border-line px-3 py-2 text-ink-2 transition-colors peer-checked:border-amber peer-checked:bg-amber peer-checked:text-black peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-amber">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Budget" id={id("budget")}>
            <select id={id("budget")} name="budget" className={`${inputCls} [&>option]:bg-black`} defaultValue={v.budget || BUDGETS[4]}>
              {BUDGETS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </>
      )}

      <Field label={variant === "order" ? "Note (optional)" : "Message"} id={id("message")} error={state.errors?.message}>
        <textarea
          id={id("message")}
          name="message"
          defaultValue={v.message}
          rows={variant === "order" ? 2 : 4}
          className={`${inputCls} resize-none`}
          placeholder={
            variant === "website"
              ? "Tell me about your brand and what the site should feel like."
              : variant === "booking"
                ? "Dates, location, references, budget…"
                : undefined
          }
          aria-invalid={!!state.errors?.message}
          aria-describedby={state.errors?.message ? `${id("message")}-err` : undefined}
        />
      </Field>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-[#e08a7f]">
          {state.message}
        </p>
      )}
      {state.status === "error" && state.summary && <Fallback summary={state.summary} kind={kind} />}

      <button type="submit" disabled={pending} className="btn btn-amber justify-center self-start disabled:opacity-60" data-cursor="Send">
        {pending ? "Sending…" : submitLabel} <span className="arrow" aria-hidden>→</span>
      </button>
    </form>
  );
}
