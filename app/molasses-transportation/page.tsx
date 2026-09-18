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
   over it, so they are a solid surface. */

export const metadata: Metadata = {
  title: "Molasses transportation across Pakistan | Zia Goods & Carriage Contractor",
  description:
    "Bulk molasses transportation across Pakistan since 1991. Mild steel tankers in 10, 18 and 22 wheel configurations, capacity held through the crushing season, and weights verified at load and at discharge.",
  alternates: { canonical: "/molasses-transportation" },
};

/* What a buyer actually has to plan around. Molasses is a by-product, so
   the questions are handling and timing rather than grade. */
const handling = [
  {
    kind: "Viscosity",
    heading: "It pumps slowly, and slower when it is cold",
    body: "Molasses moves at a fraction of the rate edible oil does, and the gap widens as the temperature drops. A discharge that takes an hour in summer can take considerably longer in January. We plan the slot around the product rather than the schedule.",
  },
  {
    kind: "Density",
    heading: "Loaded to weight, not to volume",
    body: "Molasses is substantially heavier than oil for the same volume, so a tanker reaches its legal axle weight well before the tank is full. Anyone quoting you by tank capacity rather than by weight has not moved much of it.",
  },
  {
    kind: "Residue",
    heading: "It clings, so the tank is washed between loads",
    body: "Molasses coats the inside of a tank and does not simply drain out. Tankers are washed between consignments, and the vehicles that carry it are never the stainless steel units reserved for refined edible oil.",
  },
  {
    kind: "Destination",
    heading: "Distilleries, feed mills and the export berth",
    body: "Most of what we carry goes to ethanol and distillery plants, to feed mills, or south to Port Qasim for export. Each has a different receiving arrangement, and the discharge end is usually what sets the transit time.",
  },
];

const seasonality = [
  {
    step: "01",
    title: "Supply arrives with the crushing season",
    body: "Molasses is a by-product of sugar production, so it appears when the mills are crushing and thins out when they stop. Volume is not spread evenly across the year and capacity planned on an annual average will be short in the peak.",
  },
  {
    step: "02",
    title: "Everyone needs tankers in the same weeks",
    body: "Because the season is common to the whole industry, demand for bulk liquid capacity concentrates. Spot rates move, and mills without a contracted allocation compete for the same vehicles.",
  },
  {
    step: "03",
    title: "Contracted capacity is held, not bid for",
    body: "An annual contract fixes an agreed number of vehicles against your volume at a rate set for the term. In a seasonal cargo that is usually the difference between shipping on your schedule and shipping on whoever has a tanker free.",
  },
  {
    step: "04",
    title: "Off-season capacity goes elsewhere",
    body: "The same mild steel tankers carry raw edible oil and chemicals outside the crushing months, which is what makes holding the fleet through a seasonal cargo workable at all.",
  },
];

const fleet = [
  { label: "Configurations", value: "10, 18 and 22 wheeler" },
  { label: "Tank type", value: "Mild steel" },
  { label: "Stainless steel units used", value: "Never" },
];

/* PRD § Clients, by vertical — publication permission granted. */
const clients = [
  "Reliance Commodities",
  "Fatima Sugar Mills",
  "Al Rahim Trading",
  "Pakistan Molasses",
  "United Ethanol Industries",
  "Bulk Management",
  "Madina Sugar Mills",
];

/* PLACEHOLDER — transit times are not confirmed, and the highest-volume
   routes are an open question in the PRD. These follow the mill belt down
   to the port. Replace once the client confirms actual volumes. */
const legs = [
  { from: "Faisalabad", to: "Port Qasim", time: "Transit time to be confirmed" },
  { from: "Multan", to: "Port Qasim", time: "Transit time to be confirmed" },
  { from: "Sukkur", to: "Hyderabad", time: "Transit time to be confirmed" },
  { from: "Mill belt", to: "Distillery", time: "Transit time to be confirmed" },
];

const contractFacts = [
  { label: "Company owned", value: "49" },
  { label: "On annual contract", value: "40" },
  { label: "Common carriers", value: "10" },
];

export default function MolassesTransportation() {
  return (
    <>
      <PageHero
        eyebrow="Service · Molasses"
        title="Molasses transportation across Pakistan"
        lede="Bulk molasses moved for sugar mills, distilleries and traders since 1991. Mild steel tankers in three wheel configurations, capacity held through the crushing season, and every load weighed at both ends of the run."
        secondary={
          <a href="#seasonality" className="btn-base btn-plain">
            Capacity in the season
          </a>
        }
      />

      {/* Handling characteristics */}
      <Section
        id="handling"
        light
        eyebrow="Handling characteristics"
        title="Molasses does not move like oil"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {handling.map((item) => (
            <article key={item.kind} className="solid p-8" data-lift>
              <p className="type-mono mb-4 text-steel">{item.kind}</p>
              <h3 className="type-h3 text-cream">{item.heading}</h3>
              <p className="mt-6 text-mist">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Seasonality */}
      <Section
        id="seasonality"
        deep
        eyebrow="Sugar-mill seasonality"
        title="Capacity when the mills are crushing"
      >
        <p className="max-w-[62ch] text-mist" data-lift>
          Molasses is the one cargo on this site where timing matters more than
          specification. Supply is concentrated into the crushing season, and so
          is everybody&rsquo;s demand for tankers. How a carrier handles that
          window is the whole question.
        </p>

        <p className="type-mono mt-6 text-steel" data-lift>
          Season dates pending confirmation
        </p>

        <ol className="mt-14" data-lift-group>
          {seasonality.map((item, index) => (
            <li
              key={item.step}
              data-lift
              className={`grid grid-cols-[48px_1fr] gap-6 border-t border-line py-6 ${
                index === seasonality.length - 1 ? "border-b" : ""
              }`}
            >
              <p className="type-mono pt-[0.35em] text-steel">{item.step}</p>
              <div>
                <h3 className="type-h3 text-cream">{item.title}</h3>
                <p className="mt-4 max-w-[64ch] type-body-sm text-mist">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* The fleet for this cargo */}
      <Section
        id="fleet"
        eyebrow="Vehicles"
        title="Mild steel tankers, in three configurations"
      >
        <div className="max-w-[68ch]">
          <p className="text-mist" data-lift>
            Molasses travels in mild steel tankers across the 10, 18 and 22
            wheel configurations. Which one goes out is a question of the volume
            moving and what the receiving end can take, not of what happens to
            be in the yard.
          </p>
          <p className="mt-6 text-mist" data-lift>
            The ten stainless steel tankers are not part of this fleet and never
            carry molasses. They are dedicated to refined edible oil and nothing
            else, which is only a meaningful claim if it holds in the weeks when
            every other tanker is committed. By-product runs on separate
            vehicles again, kept apart from anything food-grade.
          </p>

          <dl
            className="mt-14 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3"
            data-lift
          >
            {fleet.map((fact) => (
              <div key={fact.label}>
                <dt className="type-mono mb-4 text-steel">{fact.label}</dt>
                <dd className="type-lede m-0 text-cream">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8" data-lift>
            <a href="/fleet" className="btn-base btn-ghost">
              See the full fleet
            </a>
          </p>
        </div>
      </Section>

      {/* Verified weights */}
      <Section
        id="verified-weights"
        deep
        eyebrow="Procedure"
        title="Weighed at load. Weighed again at discharge."
      >
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div data-lift-group>
            <p className="max-w-[58ch] text-mist" data-lift>
              A dense, slow-pumping cargo discharged into someone else&rsquo;s
              tank is exactly the situation where a shortfall is hard to prove
              afterwards. The procedure is the same one we run on every
              consignment, whatever is in the tank.
            </p>
            <p className="mt-6 max-w-[58ch] text-mist" data-lift>
              The tanker is weighed at the loading point and the reading recorded
              against the consignment. Four independent tracking providers cover
              the fleet and our own tracking department contacts the driver four
              times a day. It is weighed again at the discharge weighbridge, and
              you get both figures.
            </p>
            <p className="mt-6 max-w-[58ch] text-mist" data-lift>
              That is a measurement taken twice, not an assurance. It is also
              why a slow discharge is a scheduling problem rather than a
              commercial one: the number at the far end is the number that
              settles it.
            </p>
          </div>

          <div className="lg:sticky lg:top-30">
            <WeightReadout />
          </div>
        </div>
      </Section>

      {/* Routes */}
      <Section
        id="routes"
        eyebrow="Coverage"
        title="Mill belt south to the distilleries and the port"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <MapReveal className="mx-auto w-full max-w-[520px]">
            <PakistanMap
              scale="corridor"
              stops={["Lahore", "Faisalabad", "Multan", "Sukkur", "Hyderabad", "Port Qasim"]}
              label="Map of the molasses corridor running from the Punjab mill belt at Lahore and Faisalabad through Multan and Sukkur to Hyderabad and Port Qasim, drawn on Pakistan's motorway and national highway network."
            />
            <figcaption className="type-mono mt-4 text-steel">
              Punjab and Sindh mill belt down to processing and the port
            </figcaption>
          </MapReveal>

          <div data-lift-group>
            <p className="max-w-[46ch] text-mist" data-lift>
              Molasses runs the opposite way to edible oil. It starts at the
              mills in Punjab and Sindh and moves down to the distilleries and
              feed mills, or on to Port Qasim for export. We also run shorter
              mill-to-plant legs that never approach the coast.
            </p>

            <ul className="mt-8 grid gap-4">
              {legs.map((leg) => (
                <li
                  key={`${leg.from}-${leg.to}`}
                  data-lift
                  className="solid flex flex-wrap items-baseline justify-between gap-4 px-6 py-4"
                >
                  <p className="flex items-center gap-4 type-body-sm text-cream">
                    <span>{leg.from}</span>
                    <ArrowRight size={14} className="text-steel" />
                    <span>{leg.to}</span>
                  </p>
                  <p className="type-mono text-steel">{leg.time}</p>
                </li>
              ))}
            </ul>

            <p className="type-mono mt-6 text-steel" data-lift>
              Transit times pending confirmation
            </p>
          </div>
        </div>
      </Section>

      {/* Clients */}
      <Section
        id="clients"
        light
        eyebrow="Molasses clients"
        title="Sugar mills, traders and ethanol producers"
      >
        <ClientWall names={clients} note="Named with permission" />
      </Section>

      {/* Carriage contracting */}
      <Section
        id="carriage-contracting"
        eyebrow="Carriage contracting"
        title="An allocation held for your crushing season"
      >
        <div className="max-w-[68ch]" data-lift-group>
          <p className="text-mist" data-lift>
            For a seasonal cargo, contracting is the arrangement that does the
            most work. You get an agreed number of vehicles held against your
            volume for the term, at a rate fixed in advance, rather than
            negotiating in the weeks when every mill in the country wants the
            same tankers.
          </p>
          <p className="mt-6 text-mist" data-lift>
            Beyond the 49 vehicles we own, a further 40 run for us on annual
            contract and around 10 common carriers are available when a peak
            needs covering. The same weighing procedure and the same tracking
            arrangement apply on contracted runs as on spot loads.
          </p>

          <dl
            className="mt-14 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3"
            data-lift
          >
            {contractFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="type-mono mb-4 text-steel">{fact.label}</dt>
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
            cargo="molasses"
            heading="Get a price for a molasses run"
            lede="Tell us the mill, the destination and roughly what is moving. If it is for the season rather than a single load, say so and we will quote it as an allocation."
          />
        </div>
      </section>
    </>
  );
}
