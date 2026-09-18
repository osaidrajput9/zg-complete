"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

/**
 * Enquiry form — seven fields.
 *
 * Name, company and telephone are required; the PRD's field table marks
 * everything else optional, and email is optional on purpose: in this
 * market plenty of buyers give a mobile number and never check email.
 * Telephone is the channel that has to work.
 *
 * On a service page the cargo select is pre-filled to that page's cargo.
 *
 * This is a floating surface, so it is glass. Its submit is the one
 * filled button on the page, because it is the one primary action.
 *
 * PLACEHOLDER: no submission endpoint exists yet. Point ACTION at the
 * real handler once it is built; the loading, error and success states
 * below already cover a slow or failed response.
 */

const ACTION = "/api/enquiry";

const CARGO = [
  { value: "edible-oil", label: "Edible oil" },
  { value: "molasses", label: "Molasses" },
  { value: "chemicals", label: "Chemicals" },
  { value: "containers", label: "Containers and finished goods" },
  { value: "other", label: "Other" },
] as const;

type CargoValue = (typeof CARGO)[number]["value"];
type Errors = Partial<Record<"name" | "company" | "telephone" | "email", string>>;

/* Short and specific, and never a bare "something went wrong". */
const MESSAGES = {
  name: "Enter your name so we know who is asking.",
  company: "Enter your company name.",
  telephone: "Enter a telephone number. This is how we will reach you.",
  email: "Check the email address — it does not look complete.",
} as const;

export default function EnquiryForm({
  cargo,
  heading = "Request a quote",
  lede = "Tell us what is moving and where it has to get to. We will come back with a price, not a callback to ask what you meant.",
}: {
  cargo?: CargoValue;
  heading?: string;
  lede?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  /* The status line rises into place rather than appearing abruptly. */
  useEffect(() => {
    if (!status || !statusRef.current) return;

    let cancelled = false;
    (async () => {
      const [{ gsap }, { EASE, DUR, prefersReducedMotion }] = await Promise.all([
        import("gsap"),
        import("@/lib/motion"),
      ]);
      if (cancelled || !statusRef.current) return;

      if (prefersReducedMotion()) {
        gsap.set(statusRef.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        statusRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: DUR.lift, ease: EASE.lift },
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  const validate = (form: HTMLFormElement): Errors => {
    const data = new FormData(form);
    const next: Errors = {};

    (["name", "company", "telephone"] as const).forEach((field) => {
      if (!String(data.get(field) ?? "").trim()) next[field] = MESSAGES[field];
    });

    const email = form.elements.namedItem("email") as HTMLInputElement | null;
    if (email?.value.trim() && !email.checkValidity()) next.email = MESSAGES.email;

    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const found = validate(form);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLInputElement | null)?.focus();
      setStatus("Check the highlighted fields and try again.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch(ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error(String(response.status));

      form.reset();
      setStatus("Thanks — we have your enquiry and will come back with a price.");
    } catch {
      setStatus(
        "Could not send that just now. Try again, or call us and we will take the details over the phone.",
      );
    } finally {
      setSending(false);
    }
  };

  /* Clear an error as soon as the person fixes it, not on next submit. */
  const clearError = (field: keyof Errors) =>
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });

  const fieldClass =
    "min-h-11 rounded-surface border border-line bg-fill-subtle p-4 text-cream " +
    "transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] " +
    "hover:border-line-strong aria-[invalid=true]:border-cream";

  const labelClass = "flex items-baseline gap-2 text-[0.9375rem] text-cream";
  const flagClass = "font-mono text-[9px] uppercase tracking-[0.1em] text-steel";

  return (
    <div className="glass p-10 max-sm:p-6" data-lift-group>
      <div className="max-w-[48ch]">
        <h2 className="type-h2 text-cream" data-reveal>
          {heading}
        </h2>
        <p className="mt-6 text-mist" data-lift>
          {lede}
        </p>
      </div>

      <form
        ref={formRef}
        action={ACTION}
        method="post"
        noValidate
        onSubmit={onSubmit}
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2"
        data-lift
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="eq-name" className={labelClass}>
            Name <span className={flagClass}>Required</span>
          </label>
          <input
            id="eq-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "eq-name-error" : undefined}
            onInput={() => clearError("name")}
          />
          {errors.name && (
            <p id="eq-name-error" className="text-[0.9375rem] text-cream">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eq-company" className={labelClass}>
            Company name <span className={flagClass}>Required</span>
          </label>
          <input
            id="eq-company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            className={fieldClass}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "eq-company-error" : undefined}
            onInput={() => clearError("company")}
          />
          {errors.company && (
            <p id="eq-company-error" className="text-[0.9375rem] text-cream">
              {errors.company}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eq-tel" className={labelClass}>
            Telephone <span className={flagClass}>Required</span>
          </label>
          <input
            id="eq-tel"
            name="telephone"
            type="tel"
            autoComplete="tel"
            required
            className={fieldClass}
            aria-invalid={Boolean(errors.telephone)}
            aria-describedby={errors.telephone ? "eq-tel-error" : undefined}
            onInput={() => clearError("telephone")}
          />
          {errors.telephone && (
            <p id="eq-tel-error" className="text-[0.9375rem] text-cream">
              {errors.telephone}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eq-email" className={labelClass}>
            Email <span className={flagClass}>Optional</span>
          </label>
          <input
            id="eq-email"
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "eq-email-error" : undefined}
            onInput={() => clearError("email")}
          />
          {errors.email && (
            <p id="eq-email-error" className="text-[0.9375rem] text-cream">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eq-cargo" className={labelClass}>
            What are you moving <span className={flagClass}>Optional</span>
          </label>
          <select
            id="eq-cargo"
            name="cargo"
            defaultValue={cargo ?? ""}
            className={`${fieldClass} appearance-none bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-[length:5px_5px,5px_5px] bg-[position:right_18px_center,right_13px_center] bg-no-repeat`}
          >
            {!cargo && <option value="">Select a cargo type</option>}
            {CARGO.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eq-route" className={labelClass}>
            Route <span className={flagClass}>Optional</span>
          </label>
          <input
            id="eq-route"
            name="route"
            type="text"
            placeholder="Origin and destination"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="eq-volume" className={labelClass}>
            Volume and frequency <span className={flagClass}>Optional</span>
          </label>
          <input
            id="eq-volume"
            name="volume"
            type="text"
            placeholder="For example, two tankers a week"
            className={fieldClass}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" className="btn-base btn-filled" disabled={sending}>
            {sending ? "Sending…" : "Send enquiry"}
          </button>
          <p className="type-mono text-steel">Three fields are all we need to price it</p>
        </div>

        {status && (
          <p
            ref={statusRef}
            role="status"
            aria-live="polite"
            className="rounded-surface border border-line-strong p-4 text-[0.9375rem] text-cream sm:col-span-2"
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
