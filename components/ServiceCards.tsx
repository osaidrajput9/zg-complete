import Link from "next/link";

import { ArrowRight } from "@/components/Icon";

/**
 * What we move — three routes into the service pages.
 *
 * Fill-based blocks rather than floating cards with shadows: they sit on
 * a flat section, so they are a solid surface and the hover shifts the
 * fill rather than lifting the card off a page it was never above.
 */

const SERVICES = [
  {
    href: "/edible-oil-transportation",
    label: "Edible oil",
    title: "Raw and refined, nationwide",
    body: "Bulk oil from Port Qasim and from crushing plants to refineries and packers. Ten stainless steel tankers carry refined oil and nothing else.",
    spec: "MS and SS tankers · 10, 18 and 22 wheeler",
  },
  {
    href: "/molasses-transportation",
    label: "Molasses",
    title: "Mill belt to distillery and port",
    body: "Seasonal volume out of the sugar mills to distilleries, feed mills and the export berth, loaded to weight rather than to tank capacity.",
    spec: "MS tankers · 10, 18 and 22 wheeler",
  },
  {
    href: "/containers-finished-goods",
    label: "Containers",
    title: "Packed and finished goods",
    body: "Containerised freight and packed oil products between the port and upcountry distribution, with half bodies for consignments that do not fill a vehicle.",
    spec: "20ft and 40ft beds · flatbeds · half bodies",
  },
];

export default function ServiceCards() {
  return (
    <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {SERVICES.map((service) => (
        <li key={service.href} data-lift>
          <Link
            href={service.href}
            className="group flex h-full flex-col bg-fill-subtle p-8 transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:bg-fill-hover"
          >
            <p className="type-mono mb-4 text-steel">{service.label}</p>
            <h3 className="type-h3 text-cream">{service.title}</h3>
            <p className="mt-4 type-body-sm text-mist">{service.body}</p>

            <p className="type-mono mt-8 border-t border-line pt-6 text-steel">
              {service.spec}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 type-body-sm text-cream">
              What we carry
              <ArrowRight
                size={14}
                className="transition-transform duration-[var(--hover-duration)] ease-[var(--hover-ease)] group-hover:translate-x-1"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
