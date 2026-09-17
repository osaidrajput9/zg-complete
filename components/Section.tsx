import type { ReactNode } from "react";

/* A standard content section. `deep` alternates the background. Sections
   are flat surfaces, so anything that needs a container here is solid,
   never glass. */

export default function Section({
  id,
  eyebrow,
  title,
  deep = false,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  deep?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`section-y ${deep ? "bg-navy-deep" : ""}`}>
      <div className="shell" data-lift-group>
        {eyebrow && (
          <p className="type-mono mb-5 text-steel" data-lift>
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
