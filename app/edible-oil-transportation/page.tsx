import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import MapReveal from "@/components/MapReveal";
import PakistanMap from "@/components/PakistanMap";
import WeightReadout from "@/components/WeightReadout";
import ClientWall from "@/components/ClientWall";
import EnquiryForm from "@/components/EnquiryForm";
import { ArrowRight } from "@/components/Icon";

/* Glass appears on this page only where something floats: the nav and the
   enquiry form container. The route cards sit beside the map rather than
   over it, so they are a solid surface — glass with nothing behind it is
   just a muddy rectangle. */

export const metadata: Metadata = {
  title: "Edible oil transportation across Pakistan | Zia Goods & Carriage Contractor",
  description:
    "Bulk edible oil transportation across Pakistan since 1991. Ten dedicated stainless steel tankers for refined oil, mild steel capacity for raw, and weights verified at load and at discharge.",
  alternates: { canonical: "/edible-oil-transportation" },
};

const grades = [
  {
    kind: "Raw",
    heading: "Raw oil",
    spec: "MS tankers · 10, 18 and 22 wheeler",
    body: "Crude and semi-processed oil moving from the port and from crushing plants to refineries. It is going to be processed on arrival, so the handling question is quantity rather than grade: what left the loading point has to be what arrives.",
    points: [
      "Carried in mild steel tankers across the 10, 18 and 22 wheel configurations",
      "Weighed at the loading point and again at discharge",
      "Routed with the same tracking arrangement as every other load",
    ],
  },
  {
    kind: "Refined",
    heading: "Refined oil",
    spec: "SS tankers · 10 units, dedicated",
    body: "Finished cooking oil going out to packers and distributors. It will not be reprocessed, so whatever the tank last held is now part of the product. That is why refined oil goes in stainless steel here, and why those tankers do nothing else.",
    points: [
      "Carried only in the ten dedicated stainless steel tankers",
      "Never rotated onto chemicals, molasses or by-product",
      "Same verified weights at both ends of the run",
    ],
  },
];

const procedure = [
  {
    step: "01",
    title: "Weighed at load",
    body: "The tanker is weighed at the loading point and the reading is recorded against the consignment before it leaves.",
  },
  {
    step: "02",
    title: "Tracked in transit",
    body: "Four independent tracking providers cover the fleet, and our own tracking department contacts the driver four times a day for the duration of the run.",
  },
  {
    step: "03",
    title: "Weighed at discharge",
    body: "The tanker is weighed again at the discharge weighbridge. The second reading is recorded against the first.",
  },
  {
    step: "04",
    title: "Both readings shared",
    body: "You get both figures. A shortfall is a number on a document rather than an argument between two people who each remember it differently.",
  },
];

const clients = [
  "Dalda Foods",
  "Habib Oil Mills",
  "Unity Foods",
  "Spring Edible Oil Mills",
  "Shujabad Agro Industries",
  "Universal Edible Oil",
  "Shareef Extraction Plant",
  "Shareef Ghee Mill Kundri",
  "Sahib Oil Trader Hyderabad",
  "M.A Oil",
  "Gulzar Foods",
];

/* PLACEHOLDER — transit times are not confirmed. The PRD lists the
   highest-volume routes as an open question and the corridor follows the
   assumed Karachi–Sargodha spine. Replace both the legs and the durations
   once the client confirms actual volumes and timings. */
const legs = [
  { from: "Port Qasim", to: "Hyderabad", time: "Transit time to be confirmed" },
  { from: "Port Qasim", to: "Multan", time: "Transit time to be confirmed" },
  { from: "Port Qasim", to: "Faisalabad", time: "Transit time to be confirmed" },
  { from: "Port Qasim", to: "Sargodha", time: "Transit time to be confirmed" },
];

const fleetFacts = [
  { label: "Company owned", value: "49" },
  { label: "On annual contract", value: "40" },
  { label: "Common carriers", value: "10" },
];

export default function EdibleOilTransportation() {
  return (
    <>
      <PageHero
        eyebrow="Service · Edible oil"
        title="Edible oil transportation across Pakistan"
        lede="Raw and refined, moved nationwide for oil mills, refineries and packers since 1991. Ten stainless steel tankers dedicated to edible oil and nothing else, and every load weighed at both ends of the run."
        secondary={
          <a href="#stainless-steel" className="btn-base btn-plain">
            Why stainless steel
          </a>
        }
      />

      {/* Raw versus refined */}
      <Section
        id="raw-and-refined"
        eyebrow="What each grade needs"
        title="Raw and refined are not the same job"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {grades.map((grade) => (
            <article key={grade.kind} className="solid p-8" data-lift>
              <p className="type-mono mb-4 text-steel">{grade.kind}</p>
              <h3 className="type-h3 text-cream">{grade.heading}</h3>
              <p className="type-mono mt-2 text-steel">{grade.spec}</p>
              <p className="mt-5 text-mist">{grade.body}</p>

              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-[0.9375rem] text-mist">
                {grade.points.map((point) => (
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

      {/* The stainless steel fleet */}
      <Section
        id="stainless-steel"
        deep
        eyebrow="Dedicated capacity"
        title="Ten stainless steel tankers that carry one thing"
      >
        <div className="max-w-[68ch]">
          <p className="text-mist" data-lift>
            Dedicated means these ten tankers are not scheduled onto anything
            else. They do not take a chemical load on the return leg, they do
            not carry molasses when the sugar season is busy, and they are not
            borrowed for by-product when capacity is tight. A stainless steel
            tanker that carried a solvent last week is not a food-grade tanker,
            whatever it is washed with.
          </p>
          <p className="mt-5 text-mist" data-lift>
            That is a commercial decision rather than a technical one. Keeping
            ten units on a single cargo type costs utilisation — an empty return
            leg is an empty return leg. It is the only way to say that the tank
            your cooking oil travels in has never held anything but cooking oil,
            and mean it.
          </p>

          <dl
            className="mt-14 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3"
            data-lift
          >
            <div>
              <dt className="type-mono mb-3 text-steel">Units</dt>
              <dd className="type-figure m-0 text-cream">10</dd>
            </div>
            <div>
              <dt className="type-mono mb-3 text-steel">Cargo</dt>
              <dd className="type-lede m-0 text-cream">Refined edible oil only</dd>
            </div>
            <div>
              <dt className="type-mono mb-3 text-steel">Rotated onto other cargo</dt>
              <dd className="type-lede m-0 text-cream">Never</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* Verified weights */}
      <Section
        id="verified-weights"
        eyebrow="Procedure"
        title="Weighed at load. Weighed again at discharge."
      >
        <p className="max-w-[62ch] text-mist" data-lift>
          Short deliveries are the structural problem in this category, and they
          are usually impossible to prove after the fact. The procedure below is
          what we run on every consignment. It is not a guarantee; it is a
          measurement taken twice, by people who write both numbers down.
        </p>

        <div className="mt-14 grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <ol data-lift-group>
            {procedure.map((item, index) => (
              <li
                key={item.step}
                data-lift
                className={`grid grid-cols-[48px_1fr] gap-5 border-t border-line py-6 ${
                  index === procedure.length - 1 ? "border-b" : ""
                }`}
              >
                <p className="type-mono pt-[0.35em] text-steel">{item.step}</p>
                <div>
                  <h3 className="type-h3 text-cream">{item.title}</h3>
                  <p className="mt-3 text-[0.9375rem] text-mist">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="lg:sticky lg:top-30">
            <WeightReadout />
          </div>
        </div>
      </Section>

      {/* Routes */}
      <Section
        id="routes"
        deep
        eyebrow="Coverage"
        title="Port Qasim inland, and the motorway network north"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <MapReveal className="mx-auto w-full max-w-[520px]">
            <PakistanMap
              scale="corridor"
              stops={["Port Qasim", "Hyderabad", "Sukkur", "Multan", "Faisalabad"]}
              label="Map of the edible oil corridor from Port Qasim inland through Hyderabad, Sukkur and Multan to Faisalabad, drawn on Pakistan's motorway and national highway network."
            />
            <figcaption className="type-mono mt-4 text-steel">
              Port Qasim inland to central and northern Punjab
            </figcaption>
          </MapReveal>

          <div data-lift-group>
            <p className="max-w-[46ch] text-mist" data-lift>
              Most edible oil work starts at Port Qasim or at a crushing plant
              and runs inland on the national highway and motorway network. We
              also run mill-to-mill and mill-to-packer legs that never touch the
              port.
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

            <p className="type-mono mt-5 text-steel" data-lift>
              Transit times pending confirmation
            </p>
          </div>
        </div>
      </Section>

      {/* Clients */}
      <Section id="clients" eyebrow="Edible oil clients" title="Who we move cooking oil for">
        <ClientWall names={clients} note="Named with permission" />
      </Section>

      {/* Carriage contracting */}
      <Section
        id="carriage-contracting"
        deep
        eyebrow="Carriage contracting"
        title="Contracted capacity, held for your season"
      >
        <div className="max-w-[68ch]" data-lift-group>
          <p className="text-mist" data-lift>
            Alongside spot loads we contract capacity annually. You get an agreed
            number of vehicles held against your volume, at a rate fixed for the
            term, with the same weighing procedure and the same tracking
            arrangement on every run.
          </p>
          <p className="mt-5 text-mist" data-lift>
            Beyond the 49 vehicles we own, a further 40 run for us on annual
            contract and around 10 common carriers are available when a peak
            needs covering. For a refinery or a packer with a predictable monthly
            draw, contracting is usually the cheaper of the two arrangements and
            removes the scramble for tankers when everyone needs them at once.
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
      <section id="enquiry" className="section-y">
        <div className="shell">
          <EnquiryForm
            cargo="edible-oil"
            heading="Get a price for an edible oil run"
            lede="Tell us the route and roughly how much is moving. If it is refined oil, say so — that routes straight to whoever is holding the stainless steel capacity."
          />
        </div>
      </section>
    </>
  );
}
