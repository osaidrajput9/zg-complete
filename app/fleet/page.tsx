import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import StatStrip from "@/components/StatStrip";
import FleetTable, { type FleetRow } from "@/components/FleetTable";

/* Glass appears on this page only on the nav and its menus. Everything
   here sits on a flat section, so every surface is solid.

   No photography. The PRD's open question is explicit: if there is no
   usable imagery of tankers, shore tanks or loading operations, commit to
   diagrams and typography rather than poor stock. None has been supplied,
   so there are no image placeholders here either. */

export const metadata: Metadata = {
  title: "HTV transport services and fleet | Zia Goods & Carriage Contractor",
  description:
    "49 company-owned HTV vehicles and 40 more on annual contract. Mild steel and stainless steel tankers, container beds, flatbeds and half bodies for bulk liquid tanker transport across Pakistan.",
  alternates: { canonical: "/fleet" },
};

const stats = [
  { value: 49, label: "Company owned", note: "Vehicles on our own books" },
  { value: 40, label: "On annual contract", note: "Committed to us for the term" },
  { value: 10, label: "Common carriers", note: "Available to cover a peak", prefix: "~" },
  { value: 10, label: "Stainless steel", note: "Dedicated to refined edible oil" },
];

/* PRD § Fleet. Per-type unit counts are an open question for every row
   except stainless steel, which the client has confirmed at 10. */
const rows: FleetRow[] = [
  {
    category: "MS oil tankers",
    types: "10, 18 and 22 wheeler",
    carries: "Raw edible oil, chemicals, molasses",
    units: null,
    href: "#ms-tankers",
  },
  {
    category: "By-product tankers",
    types: "10 wheeler, separate",
    carries: "By-product, kept apart from food-grade",
    units: null,
    href: "#by-product",
  },
  {
    category: "SS tankers",
    types: "Stainless steel, dedicated",
    carries: "Refined edible oil only",
    units: "10",
    href: "#ss-tankers",
  },
  {
    category: "Container beds",
    types: "20ft and 40ft",
    carries: "Finished goods, packed oil",
    units: null,
    href: "#container-beds",
  },
  {
    category: "Flatbeds",
    types: "18 and 22 wheeler",
    carries: "General freight",
    units: null,
    href: "#flatbeds",
  },
  {
    category: "Half bodies",
    types: "Part-load configuration",
    carries: "Part loads, shorter runs",
    units: null,
    href: "#half-bodies",
  },
];

const categories = [
  {
    id: "ms-tankers",
    name: "MS oil tankers",
    spec: "10, 18 and 22 wheeler",
    body: "The working majority of the fleet. Mild steel tankers carry raw edible oil from the port and from crushing plants, chemicals for industrial customers, and molasses through the crushing season. The wheel configuration is chosen against the volume moving and what the receiving end can take.",
    note: "These tankers are washed between cargo types. They are not, and are never described as, dedicated capacity.",
  },
  {
    id: "by-product",
    name: "By-product tankers",
    spec: "10 wheeler, kept separate",
    body: "By-product runs on its own vehicles. Keeping it off the tankers that carry food-grade cargo is the point of holding them separately, and it is a smaller commitment than the stainless steel fleet but the same argument.",
    note: "Separation here is what makes the food-grade claim elsewhere on this site checkable rather than rhetorical.",
  },
  {
    id: "ss-tankers",
    name: "SS tankers",
    spec: "10 units, dedicated",
    body: "Ten stainless steel tankers that carry refined edible oil and nothing else. They are not scheduled onto chemicals on a return leg, not borrowed for molasses in the season, and not used for by-product when capacity is tight.",
    note: "This is the only row in the table with a confirmed count, and the only one where the count is part of the argument.",
  },
  {
    id: "container-beds",
    name: "Container beds",
    spec: "20ft and 40ft",
    body: "Beds for containerised movement — packed oil products, finished goods and general containerised freight between the port and upcountry distribution.",
    note: null,
  },
  {
    id: "flatbeds",
    name: "Flatbeds",
    spec: "18 and 22 wheeler",
    body: "General freight that does not need a tank or a container. Machinery, palletised goods and anything that loads and secures flat.",
    note: null,
  },
  {
    id: "half-bodies",
    name: "Half bodies",
    spec: "Part-load configuration",
    body: "For consignments that do not fill a full vehicle and for shorter runs where a full body is the wrong unit of cost. Useful where a buyer wants regular smaller deliveries rather than occasional large ones.",
    note: null,
  },
];

/* PRD § Tracking partners — all four confirmed. */
const trackingPartners = [
  "MegaTech Trackers",
  "Bizintel",
  "iTchnologi Group / Falcon-i",
  "Tracking World",
];

export default function Fleet() {
  return (
    <>
      <PageHero
        eyebrow="Fleet"
        title="HTV transport services across Pakistan"
        lede="49 company-owned vehicles and 40 more on annual contract, covering bulk liquid tanker transport, containerised freight and general haulage. Every vehicle is HTV class, tracked by four independent providers, and checked against the driver four times a day."
        ctaHref="/contact"
        secondary={
          <a href="#categories" className="btn-base btn-plain">
            What each type carries
          </a>
        }
      />

      {/* The numbers */}
      <section className="section-y">
        <div className="shell">
          <StatStrip stats={stats} />
        </div>
      </section>

      {/* The table */}
      <Section
        id="fleet-table"
        light
        eyebrow="By vehicle category"
        title="What we run, and what each type carries"
      >
        <p className="mb-14 max-w-[62ch] text-mist" data-lift>
          Six categories, split by what they can carry rather than by what
          they look like. The unit count is confirmed for the stainless steel
          tankers; the rest are being counted properly rather than estimated,
          and this table will carry real figures when they are.
        </p>

        <div data-lift-group>
          <FleetTable rows={rows} />
        </div>
      </Section>

      {/* Category detail */}
      <Section
        id="categories"
        eyebrow="Category detail"
        title="Why the fleet is split this way"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {categories.map((category) => (
            <article key={category.id} id={category.id} className="solid p-8" data-lift>
              <p className="type-mono mb-4 text-steel">{category.spec}</p>
              <h3 className="type-h3 text-cream">{category.name}</h3>
              <p className="mt-6 text-mist">{category.body}</p>
              {category.note && (
                <p className="mt-6 border-t border-line pt-6 type-body-sm text-steel">
                  {category.note}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* HTV */}
      <Section id="htv" deep eyebrow="Vehicle class" title="HTV only, and drivers licensed for it">
        <div className="max-w-[68ch]">
          <p className="text-mist" data-lift>
            Every vehicle in the fleet is HTV class, and the drivers who operate
            them hold HTV licences. That is the category Pakistani regulators and
            buyers actually use, and it is worth stating plainly rather than
            writing around: a carrier running lighter vehicles on heavy work is a
            problem that surfaces at a weighbridge or a checkpoint, not in a
            quotation.
          </p>
          <p className="mt-6 text-mist" data-lift>
            The distinction matters most on long motorway runs with a full tank,
            which is most of what we do.
          </p>
        </div>
      </Section>

      {/* Tracking */}
      <Section
        id="tracking"
        light
        eyebrow="Tracking arrangement"
        title="Four providers, and four contacts a day"
      >
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div data-lift-group>
            <p className="max-w-[58ch] text-mist" data-lift>
              We contract four independent tracking providers rather than one.
              A single provider is a single point of failure, and in this market
              coverage varies by route and by network — four overlapping
              services means a vehicle does not go quiet because one of them has
              a bad day.
            </p>
            <p className="mt-6 max-w-[58ch] text-mist" data-lift>
              Alongside the hardware, an in-house tracking department contacts
              every driver four times a day for the duration of a run. That is a
              person asking where the vehicle is and what it is doing, which is
              the part that catches a problem a map does not show.
            </p>
            <p className="mt-6 max-w-[58ch] text-mist" data-lift>
              The diagram elsewhere on this site shows the shape of the network,
              not a feed. We do not publish vehicle positions, and we do not
              attach identifiers or tonnages to anything on it.
            </p>
          </div>

          <div className="solid p-8" data-lift>
            <p className="type-mono mb-6 text-steel">Tracking providers</p>
            <ul className="space-y-4">
              {trackingPartners.map((partner) => (
                <li
                  key={partner}
                  className="border-b border-line pb-4 type-body-sm text-cream last:border-0 last:pb-0"
                >
                  {partner}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-line pt-6 type-body-sm text-steel">
              Four contacts with the driver every day, for the duration of every
              run.
            </p>
          </div>
        </div>
      </Section>

      {/* Maintenance */}
      <Section id="maintenance" deep eyebrow="Maintenance" title="Keeping the fleet on the road">
        <div className="max-w-[68ch]">
          <p className="text-mist" data-lift>
            A vehicle that breaks down mid-route is a delayed consignment and a
            load sitting somewhere it should not be. Maintenance is scheduled
            against the fleet rather than run reactively.
          </p>
          <p className="type-mono mt-8 text-steel" data-lift>
            Service intervals, workshop arrangement and inspection standards
            pending confirmation
          </p>
        </div>
      </Section>

      {/* Route to the enquiry form */}
      <section className="section-y">
        <div className="shell">
          <div className="max-w-[62ch]" data-lift-group>
            <h2 className="type-h2 text-cream" data-reveal>
              Tell us what needs moving
            </h2>
            <p className="mt-6 text-mist" data-lift>
              If you know the cargo and the route, we can price it. If you are
              working out whether the fleet fits the job, say what you are moving
              and we will tell you which vehicle it goes on.
            </p>
            <p className="mt-10" data-lift>
              <Link href="/contact" className="btn-base btn-filled">
                Request a quote
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
