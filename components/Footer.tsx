import Link from "next/link";
import LogoMark from "@/components/LogoMark";

/* Footer — flat, so it is a solid surface rather than glass. Orders and
   Assigned vehicle tracking appear only here until they are real
   products rather than placeholders.

   PLACEHOLDER: the head-office street address and the telephone number
   are not in the brief. Port Qasim below is the confirmed address. */

const services = [
  { href: "/edible-oil-transportation", label: "Edible oil transportation" },
  { href: "/molasses-transportation", label: "Molasses transportation" },
  { href: "/containers-finished-goods", label: "Containers and finished goods" },
];

const company = [
  { href: "/fleet", label: "Fleet" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const portal = [
  { href: "/orders", label: "Orders" },
  { href: "/tracking", label: "Assigned vehicle tracking" },
];

const label = "type-mono mb-4 text-steel";
const listLink =
  "text-mist transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:text-cream";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-navy-deep pb-8 pt-18">
      <div className="shell grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="inline-flex text-cream"
            aria-label="Zia Goods and Carriage Contractor — home"
          >
            <LogoMark height="34px" />
          </Link>
          <p className="mt-6 max-w-[26ch] type-body-sm text-steel">
            Bulk liquid haulage across Pakistan since 1991.
          </p>
        </div>

        <div>
          <h2 className={label}>Head office</h2>
          <address className="type-body-sm not-italic leading-relaxed text-mist">
            Karachi, Sindh
            <br />
            <span className="text-steel">Street address to be confirmed</span>
          </address>

          <h2 className={`${label} mt-8`}>Site office</h2>
          <address className="type-body-sm not-italic leading-relaxed text-mist">
            Plot 290, Main National Highway,
            <br />
            Razzakabad, Bin Qasim, Karachi
          </address>

          <h2 className={`${label} mt-8`}>Branch</h2>
          <address className="type-body-sm not-italic text-mist">Sargodha, Punjab</address>
        </div>

        <div>
          <h2 className={label}>Services</h2>
          <ul className="space-y-2 type-body-sm">
            {services.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={listLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className={`${label} mt-8`}>Company</h2>
          <ul className="space-y-2 type-body-sm">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={listLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={label}>Client portal</h2>
          <ul className="space-y-2 type-body-sm">
            {portal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={listLink}>
                  {link.label}
                  <span className="ml-2 inline-block rounded-button border border-line px-2 align-[2px] font-mono text-[9px] uppercase tracking-[0.1em] text-steel">
                    Coming soon
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 className={`${label} mt-8`}>Contact</h2>
          <ul className="space-y-2 type-body-sm text-mist">
            <li>M. Zeeshan Malik</li>
            <li>
              <a href="mailto:ziagoodsncarriage@gmail.com" className={listLink}>
                ziagoodsncarriage@gmail.com
              </a>
            </li>
            <li className="text-steel">Telephone to be confirmed</li>
          </ul>
        </div>
      </div>

      <div className="shell mt-18 flex flex-col justify-between gap-4 border-t border-line pt-6 sm:flex-row">
        <p className="type-mono text-steel">© 1991–2026 Zia Goods &amp; Carriage Contractor</p>
        <p className="type-mono text-steel">We go everywhere. Nothing goes missing.</p>
      </div>
    </footer>
  );
}
