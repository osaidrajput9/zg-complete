import Link from "next/link";

import { YEARS_OPERATING } from "@/lib/site";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ChecksStrip from "@/components/ChecksStrip";
import ServiceCards from "@/components/ServiceCards";
import StatStrip from "@/components/StatStrip";
import ClientWall from "@/components/ClientWall";
import EnquiryForm from "@/components/EnquiryForm";

/* Home. The hero is the map; everything below it is the PRD's § Home
   running order — four checks a day, what we move, dedicated stainless
   steel, fleet at a glance, the client wall, and the enquiry block. */

const fleet = [
  { value: 49, label: "Company owned", note: "Vehicles on our own books" },
  { value: 40, label: "On annual contract", note: "Committed to us for the term" },
  { value: 10, label: "Common carriers", note: "Available to cover a peak", prefix: "~" },
  { value: YEARS_OPERATING, label: "Years on the road", note: "Carrying bulk liquid since 1991" },
];

/* PRD § Clients, by vertical. Publication permission is granted for every
   name here. Ordered to spread the verticals across the wall rather than
   stacking one trade in a block. */
const clients = [
  "Dalda Foods",
  "Fatima Sugar Mills",
  "National Refinery",
  "Habib Oil Mills",
  "Reliance Commodities",
  "Master Feeds",
  "Unity Foods",
  "Pakistan Molasses",
  "Biotech Energy",
  "Spring Edible Oil Mills",
  "United Ethanol Industries",
  "China Pakistan Feeds Lahore",
  "Shujabad Agro Industries",
  "Al Rahim Trading",
  "Power Chemical Industries",
  "Universal Edible Oil",
  "Madina Sugar Mills",
  "Sohna Feeds",
  "Shareef Extraction Plant",
  "Bulk Management",
  "National Petrocarbon",
  "Shareef Ghee Mill Kundri",
  "Apex Feeds",
  "Azhar Soap Corporation",
  "Sahib Oil Trader Hyderabad",
  "Ishan Feeds",
  "Punjab Soap Factory",
  "M.A Oil",
  "GS Feeds",
  "Sethi Soap Islamabad",
  "Gulzar Foods",
  "A One Feeds",
  "Tanveer Soap Karachi",
  "Fatima Group of Industries",
  "Model Poultry Products",
  "Mukhtiar Soap Karachi",
  "Synergy Packaging",
  "Hashmi Feeds Mirpurkhas",
  "Barkat Soap Faisalabad",
  "Bake Parlour",
  "Pakistan Terminal Operators",
  "Shan Soap Factory Lahore",
  "Rasool Group of Companies",
  "Ali Corporation",
  "Pakistan Soap Factory Sahiwal",
  "Dilawer Soap Karachi",
  "Yaqoob Soap Multan",
  "Hoor Soap Multan",
  "Khan Soap Factory",
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Four checks a day */}
      <Section
        id="checks"
        eyebrow="The tracking department"
        title="Four checks a day, on every vehicle"
      >
        <p className="type-lede mb-14 max-w-[58ch] text-mist" data-lift>
          Four independent tracking providers cover the fleet, and our own
          tracking department contacts the driver four times a day for the
          duration of every run. A tracker tells you where a vehicle is. Only a
          driver tells you why it is there.
        </p>

        <ChecksStrip />

        <p className="type-mono mt-14 text-steel" data-lift>
          Check schedule pending confirmation of business hours
        </p>
      </Section>

      {/* What we move */}
      <Section
        id="services"
        deep
        eyebrow="What we move"
        title="Three kinds of work, one fleet behind them"
      >
        <ServiceCards />
      </Section>

      {/* Dedicated stainless steel */}
      <Section
        id="stainless-steel"
        light
        eyebrow="Dedicated capacity"
        title="Ten stainless steel tankers that carry one thing"
      >
        <div className="max-w-[68ch]" data-lift-group>
          <p className="text-mist" data-lift>
            Refined cooking oil will not be reprocessed on arrival, so whatever
            the tank last held is now part of the product. Ten of our tankers
            are stainless steel and carry refined edible oil only. They are not
            scheduled onto chemicals on a return leg, not borrowed for molasses
            when the season is busy, and not used for by-product when capacity
            is tight.
          </p>
          <p className="mt-5 text-mist" data-lift>
            That costs utilisation — an empty return leg is an empty return leg.
            It is the only way to say the tank your oil travels in has never
            held anything else, and mean it.
          </p>

          <div className="mt-10" data-lift>
            <Link href="/edible-oil-transportation#stainless-steel" className="btn-base btn-ghost">
              How the dedicated fleet works
            </Link>
          </div>
        </div>
      </Section>

      {/* Fleet at a glance */}
      <Section
        id="fleet"
        deep
        eyebrow="Fleet at a glance"
        title="Eighty-nine vehicles, and about ten more when a peak needs covering"
      >
        <StatStrip stats={fleet} />

        <div className="mt-14" data-lift>
          <Link href="/fleet" className="btn-base btn-ghost">
            What each vehicle type carries
          </Link>
        </div>

        <p className="type-mono mt-8 text-steel" data-lift>
          Per-type unit counts pending confirmation
        </p>
      </Section>

      {/* Client wall */}
      <Section
        id="clients"
        light
        eyebrow="Who we carry for"
        title="Oil mills, sugar mills, refineries, feed and soap"
      >
        <ClientWall names={clients} note="Named with permission" />
      </Section>

      {/* Enquiry */}
      <section id="enquiry" className="section-y bg-navy-deep">
        <div className="shell">
          <EnquiryForm
            heading="Tell us what needs moving"
            lede="Name, company and telephone are all we need to come back to you. The route and roughly what is moving shortens the conversation to one call."
          />
        </div>
      </section>
    </>
  );
}
