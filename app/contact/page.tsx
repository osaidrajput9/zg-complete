import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import EnquiryForm from "@/components/EnquiryForm";

/* The form is the page, not a footnote under a map. There is no map here
   at all: the PRD scopes that component to Home, About and the service
   pages, and a contact page that makes you scroll past a map to reach the
   form has its priorities backwards.

   Glass is on the nav, its menus and the form container. The contact
   details beside the form are unboxed typography rather than a second
   panel — a solid card next to a glass one reads as a mismatch, and the
   details are a list, not a surface. */

export const metadata: Metadata = {
  title: "Contact | Zia Goods & Carriage Contractor",
  description:
    "Request a price for bulk liquid or containerised haulage across Pakistan. Head office in Karachi, site office at Port Qasim and a branch in Sargodha.",
  alternates: { canonical: "/contact" },
};

/* PLACEHOLDER: the telephone number and business hours are both open
   questions in the PRD — the hours answer in the brief is not usable
   copy. Replace here and in the footer together. */
const reach = [
  { label: "Who you will speak to", value: "M. Zeeshan Malik", pending: false },
  { label: "Telephone", value: "To be confirmed", pending: true },
  {
    label: "Email",
    value: "ziagoodsncarriage@gmail.com",
    href: "mailto:ziagoodsncarriage@gmail.com",
    pending: false,
  },
  { label: "Business hours", value: "To be confirmed", pending: true },
];

const offices = [
  {
    role: "Head office",
    city: "Karachi",
    lines: ["Karachi, Sindh"],
    /* PLACEHOLDER: street address not supplied for the head office. */
    pending: "Street address to be confirmed",
    note: "Commercial, contracting and accounts.",
  },
  {
    role: "Site office",
    city: "Port Qasim",
    lines: ["Plot 290, Main National Highway,", "Razzakabad, Bin Qasim, Karachi"],
    pending: null,
    note: "On the ground where loading and dispatch happen.",
  },
  {
    role: "Branch",
    city: "Sargodha",
    lines: ["Sargodha, Punjab"],
    /* PLACEHOLDER: street address not supplied for the Punjab branch. */
    pending: "Street address to be confirmed",
    note: "Covering the Punjab mill belt and the northern network.",
  },
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you need moved"
        lede="Three fields are enough to get a price back. If you can add the route and roughly what is moving, we can quote it without a call first."
        ctaHref={null}
      />

      {/* The form, with the ways to reach us alongside it. */}
      <section className="section-y">
        <div className="shell grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.35fr_0.65fr]">
          <EnquiryForm
            heading="Request a quote"
            lede="Name, company and telephone are all we need to come back to you. Everything else shortens the conversation."
          />

          <div data-lift-group>
            <h2 className="type-h2 text-cream" data-reveal>
              Or reach us directly
            </h2>

            <dl className="mt-8">
              {reach.map((item) => (
                <div key={item.label} className="border-t border-line py-6" data-lift>
                  <dt className="type-mono mb-2 text-steel">{item.label}</dt>
                  <dd
                    className={`m-0 text-[0.9375rem] ${item.pending ? "text-steel" : "text-cream"}`}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="break-all text-cream transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:text-mist"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 border-t border-line pt-6 text-[0.9375rem] text-mist" data-lift>
              Telephone is the channel that works fastest. Email is optional on
              the form for the same reason — plenty of buyers in this market
              give a mobile number and never check an inbox.
            </p>
          </div>
        </div>
      </section>

      {/* The three locations, with what each one is for. */}
      <Section
        id="offices"
        light
        eyebrow="Where we are"
        title="Three offices, and what each one does"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {offices.map((office) => (
            <article key={office.role} className="solid p-8" data-lift>
              <p className="type-mono mb-4 text-steel">{office.role}</p>
              <h3 className="type-h3 text-cream">{office.city}</h3>

              <address className="mt-6 not-italic leading-relaxed text-mist">
                {office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                {office.pending && (
                  <span className="mt-2 block text-steel">{office.pending}</span>
                )}
              </address>

              <p className="mt-6 border-t border-line pt-6 text-[0.9375rem] text-steel">
                {office.note}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
