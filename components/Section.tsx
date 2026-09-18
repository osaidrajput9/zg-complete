import type { ReactNode } from "react";

/* A standard content section. Sections are flat surfaces, so anything that
   needs a container here is solid, never glass.

   Three grounds, and a page should alternate between them rather than
   run two of the same in a row:

     default  navy — the base surface
     deep     navy-deep — denser, for data and for the page's edges
     light    the warm cream surface, for sections that are mostly
              reading. `section-light` re-points the palette, so the
              markup below is identical on all three.

   `deep` and `light` are mutually exclusive; light wins if both are
   passed, because a caller asking for a light section on a page that
   alternates deep is asking for the exception. */

export default function Section({
  id,
  eyebrow,
  title,
  deep = false,
  light = false,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  deep?: boolean;
  light?: boolean;
  children: ReactNode;
}) {
  const ground = light ? "section-light" : deep ? "bg-navy-deep" : "";

  return (
    <section id={id} className={`section-y ${ground}`.trimEnd()}>
      <div className="shell" data-lift-group>
        {eyebrow && (
          <p className="type-mono mb-6 text-steel" data-lift>
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="type-h2 mb-14 max-w-[22ch] text-cream" data-reveal>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
