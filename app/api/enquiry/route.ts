import type { NextRequest } from "next/server";

/**
 * The enquiry endpoint.
 *
 * This site's job is producing enquiries, so the failure mode that mattered
 * most was the one where a buyer fills the form, sees a success message, and
 * nobody ever receives it. Nothing here returns 200 unless the enquiry has
 * actually been handed to a mail provider.
 *
 * Delivery is configured by environment rather than hardcoded:
 *
 *   ENQUIRY_TO              where enquiries land (required to send)
 *   ENQUIRY_TO_EDIBLE_OIL   optional; edible oil routes here instead
 *   ENQUIRY_FROM            verified sender address (required to send)
 *   RESEND_API_KEY          provider key (required to send)
 *
 * With none of that set — which is the state until the client supplies a
 * mailbox — the enquiry is written to the server log and the response is a
 * 503. That is deliberate. The form's error state tells the buyer to call
 * instead, which works today, where a false success would not.
 *
 * PRD § Routing lists who receives edible oil enquiries versus general
 * dispatch as an open question. The split is wired; the addresses are not.
 */

export const runtime = "nodejs";

/* Long enough for anything a person types, short enough that the endpoint
   is not a place to post a novel. */
const LIMITS = {
  name: 120,
  company: 160,
  telephone: 40,
  email: 254,
  cargo: 40,
  route: 400,
  volume: 400,
} as const;

const CARGO = ["edible-oil", "molasses", "chemicals", "containers", "other"] as const;

type Field = keyof typeof LIMITS;

const LABELS: Record<Field, string> = {
  name: "Name",
  company: "Company",
  telephone: "Telephone",
  email: "Email",
  cargo: "Moving",
  route: "Route",
  volume: "Volume and frequency",
};

type Enquiry = Partial<Record<Field, string>>;

/* The client validates too. This is the copy that counts: a request can
   reach here without going through that form at all. */
function parse(body: unknown): { ok: true; value: Enquiry } | { ok: false; reason: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, reason: "body is not an object" };
  }

  const raw = body as Record<string, unknown>;
  const value: Enquiry = {};

  for (const field of Object.keys(LIMITS) as Field[]) {
    const entry = raw[field];
    if (entry === undefined || entry === null || entry === "") continue;
    if (typeof entry !== "string") return { ok: false, reason: `${field} is not a string` };

    const trimmed = entry.trim();
    if (trimmed.length > LIMITS[field]) return { ok: false, reason: `${field} is too long` };
    value[field] = trimmed;
  }

  if (!value.name) return { ok: false, reason: "name is required" };
  if (!value.company) return { ok: false, reason: "company is required" };
  if (!value.telephone) return { ok: false, reason: "telephone is required" };

  /* Email is optional by design — in this market plenty of buyers give a
     mobile number and never check email — but a malformed one is worth
     rejecting rather than silently dropping. */
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
    return { ok: false, reason: "email is malformed" };
  }

  if (value.cargo && !CARGO.includes(value.cargo as (typeof CARGO)[number])) {
    return { ok: false, reason: "cargo is not one of the offered values" };
  }

  return { ok: true, value };
}

function format(enquiry: Enquiry) {
  return (Object.keys(LABELS) as Field[])
    .filter((field) => enquiry[field])
    .map((field) => `${LABELS[field]}: ${enquiry[field]}`)
    .join("\n");
}

async function deliver(enquiry: Enquiry) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  const to =
    enquiry.cargo === "edible-oil"
      ? process.env.ENQUIRY_TO_EDIBLE_OIL || process.env.ENQUIRY_TO
      : process.env.ENQUIRY_TO;

  if (!key || !from || !to) return { sent: false as const, reason: "mail is not configured" };

  const body = format(enquiry);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      /* Replying goes to the buyer when they left an address, so dispatch
         can answer without copying it out by hand. */
      ...(enquiry.email ? { reply_to: enquiry.email } : {}),
      subject: `Enquiry — ${enquiry.company}`,
      text: body,
    }),
  });

  if (!response.ok) {
    return { sent: false as const, reason: `provider returned ${response.status}` };
  }
  return { sent: true as const };
}

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type")?.includes("application/json") !== true) {
    return Response.json({ error: "Expected application/json." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Could not read that request." }, { status: 400 });
  }

  const parsed = parse(body);
  if (!parsed.ok) {
    /* The reason is logged, not returned: it is useful to us and of no use
       to anyone probing the endpoint. */
    console.warn(`[enquiry] rejected: ${parsed.reason}`);
    return Response.json({ error: "That enquiry was not valid." }, { status: 400 });
  }

  const result = await deliver(parsed.value);

  if (!result.sent) {
    /* Log the whole enquiry so it is recoverable from the server output
       even while delivery is unconfigured or the provider is down. */
    console.error(
      `[enquiry] NOT DELIVERED (${result.reason}). Enquiry follows:\n${format(parsed.value)}`,
    );
    return Response.json(
      { error: "Could not send that enquiry. Please call us instead." },
      { status: 503 },
    );
  }

  return Response.json({ ok: true });
}

/* Anything other than a POST is a mistake rather than an attack, and a 405
   with the right header says so more usefully than a 404. */
export async function GET() {
  return Response.json({ error: "Use POST." }, { status: 405, headers: { Allow: "POST" } });
}
