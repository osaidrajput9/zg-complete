"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Logo from "@/components/LogoMark";
import { ChevronDown, Close, Menu, Phone } from "@/components/Icon";
import { useRevealPanel } from "@/lib/useRevealPanel";

/* Floating nav — glass, because it floats over content that scrolls
   underneath it. Pinned 16px from the top, capped at the 1320px content
   width.

   Six items per the PRD: Services (dropdown to the three service pages),
   Fleet, Tracking, About, Contact, and the quote button. Orders and
   Assigned vehicle tracking are footer-only until they are real.

   The quote button is a ghost, not a filled button: DESIGN.md keeps nav
   actions plain or glass, and the page's single filled button is the
   call to action in the hero. */

const services = [
  { href: "/edible-oil-transportation", label: "Edible oil transportation" },
  { href: "/molasses-transportation", label: "Molasses transportation" },
  { href: "/containers-finished-goods", label: "Containers and finished goods" },
];

const links = [
  { href: "/fleet", label: "Fleet" },
  { href: "/tracking", label: "Tracking" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/* PLACEHOLDER: no telephone number in the brief. Replace here and in the
   footer together once the client confirms it. */
const TEL_HREF = "tel:+920000000000";

export default function Nav() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const servicesTrigger = useRef<HTMLButtonElement>(null);

  useRevealPanel(servicesOpen, servicesRef);
  useRevealPanel(menuOpen, menuRef);

  const isActive = (href: string) => pathname === href;
  const servicesActive = services.some((s) => isActive(s.href));

  /* Close on a click outside, and on Escape with focus returned to the
     control that opened the panel. */
  useEffect(() => {
    if (!servicesOpen && !menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (servicesRef.current?.contains(target) || servicesTrigger.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setServicesOpen(false);
      setMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (servicesOpen) servicesTrigger.current?.focus();
      setServicesOpen(false);
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen, menuOpen]);

  /* A route change should not leave a menu hanging open behind the new
     page. */
  useEffect(() => {
    setServicesOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const navLink =
    "inline-flex min-h-11 items-center gap-2 rounded-button px-4 type-body-sm text-mist " +
    "transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] " +
    "hover:bg-fill-hover hover:text-cream aria-[current]:text-cream";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-[var(--gutter)]">
      <nav
        className="glass pointer-events-auto mx-auto flex max-w-[1320px] items-center gap-6 py-4 pl-6 pr-4"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="flex items-center text-cream"
          aria-label="Zia Goods and Carriage Contractor — home"
        >
          <Logo height="30px" />
        </Link>

        <ul className="ml-2 hidden items-center gap-2 min-[1001px]:flex">
          <li className="relative">
            <button
              type="button"
              ref={servicesTrigger}
              className={navLink}
              aria-expanded={servicesOpen}
              aria-controls="services-menu"
              aria-current={servicesActive ? "true" : undefined}
              onClick={() => setServicesOpen((open) => !open)}
            >
              Services
              <ChevronDown
                size={10}
                className={`transition-transform duration-[var(--hover-duration)] ease-[var(--hover-ease)] ${
                  servicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              id="services-menu"
              ref={servicesRef}
              hidden
              className="glass glass-menu absolute left-0 top-[calc(100%+0.5rem)] min-w-[268px] p-2"
            >
              <ul>
                {services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="block rounded-button p-4 type-body-sm text-mist transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:bg-fill-hover hover:text-cream"
                      aria-current={isActive(service.href) ? "page" : undefined}
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={navLink}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          {/* A tap-to-call number on mobile: a significant share of
              enquiries in this category arrive by phone regardless of
              what the form does. */}
          <a
            href={TEL_HREF}
            className="flex size-11 items-center justify-center rounded-button border border-line-strong text-cream min-[1001px]:hidden"
          >
            <span className="sr-only">Call Zia Goods</span>
            <Phone />
          </a>

          <Link href="/contact" className="btn-base btn-ghost hidden min-[1001px]:inline-flex">
            Request a quote
          </Link>

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-button border border-line-strong text-cream min-[1001px]:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Menu"}</span>
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden
        className="glass glass-menu pointer-events-auto mx-auto mt-2 max-w-[1320px] p-2 min-[1001px]:hidden"
      >
        <ul>
          {[...services, ...links].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block p-4 type-body-sm text-mist transition-colors duration-[var(--hover-duration)] ease-[var(--hover-ease)] hover:text-cream"
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <Link href="/contact" className="btn-base btn-ghost w-full">
              Request a quote
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
