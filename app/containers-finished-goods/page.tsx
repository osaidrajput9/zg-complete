import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import MapReveal from "@/components/MapReveal";
import PakistanMap from "@/components/PakistanMap";
import ClientWall from "@/components/ClientWall";
import EnquiryForm from "@/components/EnquiryForm";
import { ArrowRight } from "@/components/Icon";

/* Glass appears on this page only where something floats: the nav and the
   enquiry form container. The route cards sit beside the map rather than
   over it, so they are a solid surface.

   No WeightReadout here, unlike the two bulk liquid pages. Weighing at
   both ends is the answer to a question dry cargo does not ask — a sealed
   box is not a part-full tank — and borrowing the component would weaken
   it on the pages where it is the actual argument. */

/* The PRD's SEO table has no row for this page. "Container transport" and
   "finished goods" are the terms used here; confirm against real search
   data before launch. */
export const metadata: Metadata = {
  title: "Container transport and finished goods | Zia Goods & Carriage Contractor",
  description:
    "Containerised freight and finished goods haulage across Pakistan since 1991. 20ft and 40ft container beds, 18 and 22 wheel flatbeds, and half bodies for part loads.",
  alternates: { canonical: "/containers-finished-goods" },
};

/* What actually goes on these vehicles. Packed oil is first because it is
   the same customer as the edible oil page, one step further down their
   process. */
const cargo = [
  {
    kind: "Packed",
    heading: "Packed oil products",
    spec: "Container beds · flatbeds",
    body: "Cooking oil that has been through the refinery and into tins, pouches and cartons. For a lot of our customers this is the other half of a relationship that starts with raw oil arriving in a tanker — the same plant, the same route, the product now boxed rather than bulk.",
    points: [
      "Moves from packing halls to distributors and upcountry depots",
      "Loaded as palletised or cased freight rather than pumped",
      "Same vehicles and the same tracking arrangement as general freight",
    ],
  },
  {
    kind: "Finished",
    heading: "Finished goods",
    spec: "20ft and 40ft beds",
    body: "Manufactured product moving from plant to distribution. It arrives assembled, packed and saleable, which changes what the job is: nothing needs decanting or washing down, and the whole question is whether the consignment turns up intact and on the day it was promised.",
    points: [
      "Containerised movement between the port and upcountry distribution",
      "Flatbed where the load secures flat and needs no box",
      "Routed on the same motorway and national highway network",
    ],
  },
  {
    kind: "General",
    heading: "General containerised freight",
    spec: "20ft and 40ft · 18 and 22 wheeler",
    body: "Boxes off the berth at Port Qasim and onward to Sukkur, Multan and Lahore, or the reverse leg back down to the port. This is the least specialised work we do and the most straightforward to quote: a container, a route, a date.",
    points: [
      "20ft and 40ft beds across the 18 and 22 wheel configurations",
      "Every vehicle HTV class, as with the rest of the fleet",
      "Contract or spot, depending on how regular the movement is",
    ],
  },
];

/* PRD § Fleet. Per-type unit counts are an open question for every row
   here — the client has confirmed a count only for stainless steel, which
   is not a vehicle that appears on this page. */
const equipment = [
  {
    name: "Container beds",
    spec: "20ft and 40ft",
    body: "The standard unit for containerised freight. Bed length is chosen against the box rather than the cargo, so the question at booking is which size of container is coming off the vessel or leaving the plant.",
    units: "Unit count to be confirmed",
  },
  {
    name: "Flatbeds",
    spec: "18 and 22 wheeler",
    body: "General freight that needs neither a tank nor a box. Machinery, palletised goods and anything that loads and secures flat. The wheel configuration follows the weight, the same way it does on the tanker side.",
    units: "Unit count to be confirmed",
  },
  {
    name: "Half bodies",
    spec: "Part-load configuration",
    body: "For consignments that do not fill a vehicle, and for shorter runs where a full body is the wrong unit of cost. Useful where a buyer wants regular smaller deliveries rather than occasional large ones.",
    units: "Unit count to be confirmed",
  },
];

/* Confirmed figures only — PRD § Content inventory. Nothing here is a
   claim about seals or piece counts, which the brief does not cover. */
const coverage = [
  { label: "Vehicle class", value: "HTV" },
  { label: "Tracking providers", value: "4" },
  { label: "Driver checks a day", value: "4" },
];

/* PRD § Clients, by vertical — logistics and packaging. The page spec
   names three of these; the content inventory adds Fatima Group of
   Industries, and the inventory is the source of truth. */
const clients = [
  "Fatima Group of Industries",
  "Synergy Packaging",
  "Bake Parlour",
  "Rasool Group of Companies",
];

/* PLACEHOLDER — transit times are not confirmed. The PRD lists the
   highest-volume routes as an open question and the corridor follows the
   assumed Karachi–Sargodha spine. Replace both the legs and the durations
   once the client confirms actual volumes and timings. */
const legs = [
  { from: "Port Qasim", to: "Sukkur", time: "Transit time to be confirmed" },
  { from: "Port Qasim", to: "Multan", time: "Transit time to be confirmed" },
  { from: "Port Qasim", to: "Lahore", time: "Transit time to be confirmed" },
  { from: "Lahore", to: "Port Qasim", time: "Transit time to be confirmed" },
];

const fleetFacts = [
  { label: "Company owned", value: "49" },
  { label: "On annual contract", value: "40" },
  { label: "Common carriers", value: "10" },
];

export default function ContainersFinishedGoods() {
  return (
    <>
      <PageHero
        eyebrow="Service · Containers and finished goods"
        title="Container transport and finished goods across Pakistan"
        lede="Containerised freight, packed oil products and general haulage moved nationwide since 1991. 20ft and 40ft container beds, 18 and 22 wheel flatbeds, and half bodies for consignments that do not fill a vehicle."
        secondary={
          <a href="#part-loads" className="btn-base btn-plain">
            Part loads and half bodies
          </a>
        }
      />

      {/* What moves */}
      <Section
        id="cargo"
        light
        eyebrow="What moves on them"
        title="Dry cargo, packed and ready to sell"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cargo.map((item) => (
            <article key={item.kind} className="solid p-8" data-lift>
              <p className="type-mono mb-4 text-steel">{item.kind}</p>
              <h3 className="type-h3 text-cream">{item.heading}</h3>
              <p className="type-mono mt-2 text-steel">{item.spec}</p>
              <p className="mt-5 text-mist">{item.body}</p>

              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-[0.9375rem] text-mist">
                {item.points.map((point) => (
                  <li key={point} className="relative pl-5">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.6em] h-px w-2 bg-steel"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* The equipment */}
      <Section
        id="equipment"
        deep
        eyebrow="What we run it on"
        title="Three configurations, chosen against the load"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {equipment.map((item) => (
            <article key={item.name} className="solid p-8" data-lift>
              <h3 className="type-h3 text-cream">{item.name}</h3>
              <p className="type-mono mt-2 text-steel">{item.spec}</p>
              <p className="mt-5 text-mist">{item.body}</p>
              <p className="type-mono mt-6 border-t border-line pt-6 text-steel">
                {item.units}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-10 max-w-[62ch] text-[0.9375rem] text-steel" data-lift>
          Per-type unit counts are being counted properly rather than estimated.
          The full fleet breakdown, including the tanker side, is on the{" "}
          <a
            href="/fleet"
            className="text-mist underline underline-offset-4 transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:text-cream"
          >
            fleet page
          </a>
          .
        </p>
      </Section>

      {/* Part loads */}
      <Section
        id="part-loads"
        eyebrow="Part loads"
        title="A half body is a pricing decision, not a smaller lorry"
      >
        <div className="max-w-[68ch]" data-lift-group>
          <p className="text-mist" data-lift>
            A full vehicle is the wrong unit of cost for a consignment that only
            half fills it. Paying for a 22 wheeler to move what fits in a half
            body means the empty space is on your invoice, and the usual
            workaround — waiting until there is enough to justify the vehicle —
            moves the cost into your stockholding instead.
          </p>
          <p className="mt-5 text-mist" data-lift>
            Half bodies exist for the buyer who would rather take a delivery
            every week than a large one every month, and for runs short enough
            that a full body never earns its keep. It is the same fleet, the
            same drivers and the same tracking arrangement, sized to what is
            actually moving.
          </p>

          <dl
            className="mt-14 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3"
            data-lift
          >
            {coverage.map((fact) => (
              <div key={fact.label}>
                <dt className="type-mono mb-3 text-steel">{fact.label}</dt>
                <dd className="type-figure m-0 text-cream">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Routes */}
      <Section
        id="routes"
        deep
        eyebrow="Coverage"
        title="Port Qasim to the upcountry distribution centres"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <MapReveal className="mx-auto w-full max-w-[520px]">
            <PakistanMap
              scale="corridor"
              stops={["Port Qasim", "Sukkur", "Multan", "Lahore"]}
              label="Map of the container corridor from Port Qasim north through Sukkur and Multan to Lahore, drawn on Pakistan's motorway and national highway network."
            />
            <figcaption className="type-mono mt-4 text-steel">
              Port Qasim to the upcountry distribution centres
            </figcaption>
          </MapReveal>

          <div data-lift-group>
            <p className="max-w-[46ch] text-mist" data-lift>
              Containerised work runs the port corridor in both directions —
              boxes inland to the distribution centres, and empties or export
              freight back down to Port Qasim. Packed oil and finished goods
              also move plant to depot on legs that never approach the coast.
            </p>

            <ul className="mt-8 grid gap-3">
              {legs.map((leg) => (
                <li
                  key={`${leg.from}-${leg.to}`}
                  data-lift
                  className="solid flex flex-wrap items-baseline justify-between gap-3 px-5 py-4"
                >
                  <p className="flex items-center gap-3 text-[0.9375rem] text-cream">
                    <span>{leg.from}</span>
                    <ArrowRight size={14} className="text-steel" />
                    <span>{leg.to}</span>
                  </p>
                  <p className="type-mono text-steel">{leg.time}</p>
                </li>
              ))}
            </ul>

            <p className="type-mono mt-8 text-steel" data-lift>
              Transit times pending confirmation
            </p>
          </div>
        </div>
      </Section>

      {/* Clients */}
      <Section
        id="clients"
        light
        eyebrow="Logistics and packaging clients"
        title="Who we move packed and finished goods for"
      >
        <ClientWall names={clients} note="Named with permission" />
      </Section>

      {/* Carriage contracting */}
      <Section
        id="carriage-contracting"
        deep
        eyebrow="Carriage contracting"
        title="Contracted capacity, held against your volume"
      >
        <div className="max-w-[68ch]" data-lift-group>
          <p className="text-mist" data-lift>
            Alongside spot loads we contract capacity annually. You get an agreed
            number of vehicles held against your volume, at a rate fixed for the
            term, with the same tracking arrangement on every run.
          </p>
          <p className="mt-5 text-mist" data-lift>
            Beyond the 49 vehicles we own, a further 40 run for us on annual
            contract and around 10 common carriers are available when a peak
            needs covering. Containerised movement tends to be the most regular
            work on our books — a distributor restocking on a cycle rather than
            a mill shipping to a season — and regular volume is exactly what a
            contract prices better than the spot market does.
          </p>

          <dl
            className="mt-14 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3"
            data-lift
          >
            {fleetFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="type-mono mb-3 text-steel">{fact.label}</dt>
                <dd className="type-figure m-0 text-cream">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Enquiry */}
      <section id="enquiry" className="section-y bg-navy-deep">
        <div className="shell">
          <EnquiryForm
            cargo="containers"
            heading="Get a price for a container run"
            lede="Tell us the route, the box size and roughly how often it moves. If it is a part load, say so — a half body is usually the cheaper answer and we will quote it that way."
          />
        </div>
      </section>
    </>
  );
}
