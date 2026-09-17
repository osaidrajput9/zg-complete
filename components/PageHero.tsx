import type { ReactNode } from "react";

/* Page hero for every interior page: solid navy-deep, eyebrow, H1 and
   lede, no map. The H1 is the page's single H1, carries the target search
   term, and reveals on load.

   The call to action here is filled and so is the enquiry form's
   submit, because they are thousands of pixels apart and never share a
   viewport — DESIGN.md's rule is one filled button per screen, and each
   of those screens has exactly one. The secondary link is plain. */

export default function PageHero({
  eyebrow,
  title,
  lede,
  secondary,
  ctaHref = "#enquiry",
  ctaLabel = "Request a quote",
}: {
  eyebrow: string;
  title: string;
  lede: string;
  secondary?: ReactNode;
  /** Pages without their own enquiry form route to Contact instead.
      Pass null where the page's primary element is directly below and a
      button would only scroll past nothing. */
  ctaHref?: string | null;
  ctaLabel?: string;
}) {
  return (
    <section className="border-b border-line bg-navy-deep pb-[var(--section-pad)] pt-[calc(var(--section-pad)+72px)]">
      <div className="shell" data-lift-group>
        <p className="type-mono mb-6 text-steel" data-lift>
          {eyebrow}
        </p>

        <h1 className="type-display max-w-[18ch] text-cream" data-reveal-h1>
          {title}
        </h1>

        <p className="type-lede mt-8 max-w-[58ch] text-mist" data-lift>
          {lede}
        </p>

        {(ctaHref || secondary) && (
          <div className="mt-10 flex flex-wrap items-center gap-4" data-lift>
            {ctaHref && (
              <a href={ctaHref} className="btn-base btn-filled">
                {ctaLabel}
              </a>
            )}
            {secondary}
          </div>
        )}
      </div>
    </section>
  );
}
