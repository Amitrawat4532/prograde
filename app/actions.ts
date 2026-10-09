"use server";

/**
 * One inquiry pipeline for orders, course enrolments, bookings and website
 * projects. Delivery is configured with env vars (see .env.example):
 *   INQUIRY_WEBHOOK_URL / INQUIRY_EMAIL           → Subodit (orders, courses, bookings)
 *   WEB_INQUIRY_WEBHOOK_URL / WEB_INQUIRY_EMAIL   → the web studio (website projects)
 *   RESEND_API_KEY, INQUIRY_FROM_EMAIL            → email transport
 * With nothing configured we report "unconfigured" so the UI can hand the
 * visitor a direct channel instead of pretending the message was sent.
 */

export type InquiryKind = "order" | "course" | "booking" | "website" | "contact";

export type InquiryState = {
  status: "idle" | "ok" | "error" | "unconfigured";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Plain-text summary the client can hand to a fallback channel. */
  summary?: string;
  /** Echoed back so React's post-action form reset doesn't lose input. */
  values?: Record<string, string>;
};

const KINDS: InquiryKind[] = ["order", "course", "booking", "website", "contact"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);

const subjects: Record<InquiryKind, string> = {
  order: "New LUT order",
  course: "New course enrolment",
  booking: "New project booking",
  website: "New website project",
  contact: "New message",
};

async function deliver(kind: InquiryKind, subject: string, summary: string, replyTo: string, payload: Record<string, string>) {
  const web = kind === "website";
  const webhook = web ? process.env.WEB_INQUIRY_WEBHOOK_URL : process.env.INQUIRY_WEBHOOK_URL;
  const to = web ? process.env.WEB_INQUIRY_EMAIL : process.env.INQUIRY_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  const tasks: Promise<Response>[] = [];

  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // `text` for Slack, `content` for Discord, fields for Zapier/Make/Formspree.
        body: JSON.stringify({ text: summary, content: summary.slice(0, 1900), subject, ...payload }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }
  if (resendKey && to) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.INQUIRY_FROM_EMAIL ?? "Prograde <onboarding@resend.dev>",
          to: to.split(",").map((s) => s.trim()),
          reply_to: replyTo,
          subject,
          text: summary,
        }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }
  if (!tasks.length) return "unconfigured" as const;

  const results = await Promise.allSettled(tasks);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value.ok);
  if (!delivered) console.error("[inquiry] delivery failed", results);
  return delivered ? ("ok" as const) : ("error" as const);
}

export async function sendInquiry(_prev: InquiryState, fd: FormData): Promise<InquiryState> {
  // Honeypot: real people never fill this.
  if (str(fd, "company_url")) return { status: "ok" };

  const kind = str(fd, "kind", 20) as InquiryKind;
  if (!KINDS.includes(kind)) return { status: "error", message: "Unknown request type." };

  const name = str(fd, "name", 100);
  const email = str(fd, "email", 160);
  const phone = str(fd, "phone", 40);
  const item = str(fd, "item", 160);
  const price = str(fd, "price", 40);
  const service = str(fd, "service", 80);
  const budget = str(fd, "budget", 80);
  const brand = str(fd, "brand", 200);
  const scope = fd.getAll("scope").map(String).slice(0, 10).join(", ");
  const message = str(fd, "message", 3000);

  const errors: InquiryState["errors"] = {};
  if (name.length < 2) errors.name = "Please add your name.";
  if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";
  if ((kind === "contact" || kind === "booking" || kind === "website") && message.length < 10)
    errors.message = "Tell us a little more (10+ characters).";
  if (Object.keys(errors).length)
    return {
      status: "error",
      errors,
      message: "Please check the highlighted fields.",
      values: { name, email, phone, message, brand, budget, service },
    };

  const lines = [
    `${subjects[kind]}`,
    item && `Item: ${item}${price ? ` (${price})` : ""}`,
    service && `Service: ${service}`,
    brand && `Brand / website: ${brand}`,
    scope && `Scope: ${scope}`,
    budget && `Budget: ${budget}`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    message && `\n${message}`,
  ].filter(Boolean);
  const summary = lines.join("\n");
  const subject = `${subjects[kind]}${item ? ` — ${item}` : ""} — ${name}`;

  try {
    const result = await deliver(kind, subject, summary, email, { kind, name, email, phone, item, price, service, budget, brand, scope, message });
    if (result === "ok") return { status: "ok", summary };
    if (result === "unconfigured") return { status: "unconfigured", summary };
    return { status: "error", message: "We couldn't send that just now. Please use one of the direct options below.", summary };
  } catch (err) {
    console.error("[inquiry]", err);
    return { status: "error", message: "We couldn't send that just now. Please use one of the direct options below.", summary };
  }
}
// #?