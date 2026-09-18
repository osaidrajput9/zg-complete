import type { Metadata } from "next";
import Link from "next/link";

import { YEARS_OPERATING } from "@/lib/site";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import MapReveal from "@/components/MapReveal";
import PakistanMap from "@/components/PakistanMap";
import StatStrip from "@/components/StatStrip";

/* The map here is an inset: the boundary and the three offices, no roads.
   It answers "where are you", which is a different question from the one
   the service pages ask, and borrowing their corridor would be borrowing
   their argument. */

export const metadata: Metadata = {
  title: "About | Zia Goods & Carriage Contractor",
  description:
    "Carriage contracting across Pakistan since 1991. A Karachi head office, a site office at Port Qasim, a branch at Sargodha, and a tracking department that contacts every driver four times a day.",
  alternates: { canonical: "/about" },
};

const offices = [
  {
    role: "Head office",
    city: "Karachi",
    lines: ["Karachi, Sindh"],
    note: "Street address to be confirmed",
    body: "Commercial and dispatch. Quotes, contracts and the tracking department all sit here.",
  },
  {
    role: "Site office",
    city: "Port Qasim",
    lines: ["Plot 290, Main National Highway,", "Razzakabad, Bin Qasim, Karachi"],
    note: null,
    body: "On the national highway at the port end, where the loading happens and where most inland runs start.",
  },
  {
    role: "Branch",
    city: "Sargodha",
    lines: ["Sargodha, Punjab"],
    note: "Street address to be confirmed",
    body: "The upcountry end of the corridor, covering the Punjab mill belt and the northern refining centres.",
  },
];

const history = [
  {
    step: "1991",
    title: "The company starts carrying",
    body: "Zia Goods begins as a carriage contractor moving bulk liquid. The trade has not changed since: tankers, contracts, and the same corridor between the port and the Punjab.",
  },
  {
    step: "Since",
    title: "Built around contracted capacity",
    body: "Most of the work is annual rather than spot. A mill or a refinery with a predictable monthly draw gets an agreed number of vehicles held against it, at a rate fixed for the term.",
  },
  {
    step: "Now",
    title: "Forty-nine owned, forty on contract",
    body: "Alongside the vehicles on our own books, a further forty run for us under annual contract and around ten common carriers are available when a peak needs covering.",
  },
];

const trackingPartners = [
  "MegaTech Trackers",
  "Bizintel",
  "iTchnologi Group / Falcon-i",
  "Tracking World",
];

const stats = [
  { value: YEARS_OPERATING, label: "Years on the road", note: "Carrying bulk liquid since 1991" },
  { value: 3, label: "Offices", note: "Karachi, Port Qasim and Sargodha" },
  { value: 4, label: "Tracking providers", note: "Independent of each other" },
  { value: 4, label: "Driver checks a day", note: "For the duration of every run" },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Carriage contracting since 1991"
        lede="A Karachi head office, a site office on the national highway at Port Qasim, and a branch at Sargodha. Bulk liquid in tankers, containerised freight on beds, and a tracking department whose job is to know where every vehicle is before a customer has to ask."
        ctaHref="/contact"
        secondary={
          <a href="#offices" className="btn-base btn-plain">
            Where we are
          </a>
        }
      />

      {/* 1991 onward */}
      <Section id="history" eyebrow="1991 onward" title="One trade, carried on since 1991">
        <ol className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {history.map((item) => (
            <li key={item.step} className="solid p-8" data-lift>
              <p className="type-mono mb-4 text-steel">{item.step}</p>
              <h3 className="type-h3 text-cream">{item.title}</h3>
              <p className="mt-4 text-[0.9375rem] text-mist">{item.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-14 max-w-[62ch] text-[0.9375rem] text-steel" data-lift>
          Company records carry more than one founding date and more than one
          fleet count. 1991 and 49 are the agreed figures; every other version
          in older material is superseded.
        </p>
      </Section>

      {/* The three offices */}
      <Section
        id="offices"
        deep
        eyebrow="Where we are"
        title="Three offices, one corridor between them"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <MapReveal className="mx-auto w-full max-w-[520px]">
            <PakistanMap
              scale="inset"
              stops={["Karachi", "Port Qasim", "Sargodha"]}
              label="Map of Pakistan marking the three Zia Goods offices: the head office at Karachi, the site office at Port Qasim, and the Punjab branch at Sargodha."
            />
          </MapReveal>

          <ul className="grid gap-6" data-lift-group>
            {offices.map((office) => (
              <li key={office.role} className="solid p-8" data-lift>
                <p className="type-mono mb-4 text-steel">{office.role}</p>
                <h3 className="type-h3 text-cream">{office.city}</h3>
                <address className="mt-3 text-[0.9375rem] not-italic leading-relaxed text-mist">
                  {office.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  {office.note && <span className="block text-steel">{office.note}</span>}
                </address>
                <p className="mt-4 text-[0.9375rem] text-mist">{office.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* The tracking department */}
      <Section
        id="tracking"
        eyebrow="How the operation runs"
        title="The tracking department is a department, not a dashboard"
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div className="max-w-[62ch]" data-lift-group>
            <p className="text-mist" data-lift>
              Four independent providers cover the fleet, and their reports are
              reconciled against each other rather than trusted one at a time.
              On top of that, our own staff contact the driver four times a day
              for the duration of every run.
            </p>
            <p className="mt-5 text-mist" data-lift>
              The phone call is the part that matters. A tracker will tell you a
              vehicle has not moved for three hours. It will not tell you whether
              that is a queue at a weighbridge, a gate that will not accept the
              load, or a problem. Someone has to ask, and asking four times a day
              is what makes a delay something we call you about rather than
              something you discover.
            </p>
            <p className="mt-5 text-mist" data-lift>
              Weights are recorded at the loading point and again at discharge,
              and both readings go to the customer. A shortfall is then a number
              on a document rather than an argument between two people who each
              remember it differently.
            </p>
          </div>

          <div data-lift-group>
            <h3 className="type-mono mb-5 text-steel" data-lift>
              Tracking providers
            </h3>
            <ul className="grid gap-3">
              {trackingPartners.map((partner) => (
                <li
                  key={partner}
                  data-lift
                  className="solid px-5 py-4 text-[0.9375rem] text-cream"
                >
                  {partner}
                </li>
              ))}
            </ul>

            <h3 className="type-mono mb-5 mt-10 text-steel" data-lift>
              Banking
            </h3>
            <p className="text-[0.9375rem] text-mist" data-lift>
              Banking references are available to contract customers on request.
            </p>
            <p className="type-mono mt-3 text-steel" data-lift>
              Institutions pending confirmation
            </p>
          </div>
        </div>
      </Section>

      {/* The numbers */}
      <Section id="numbers" deep eyebrow="By the numbers" title="What the operation adds up to">
        <StatStrip stats={stats} />

        <div className="mt-14 flex flex-wrap gap-4" data-lift>
          <Link href="/fleet" className="btn-base btn-ghost">
            See the fleet
          </Link>
          <Link href="/contact" className="btn-base btn-plain">
            Request a quote
          </Link>
        </div>
      </Section>
    </>
  );
}
