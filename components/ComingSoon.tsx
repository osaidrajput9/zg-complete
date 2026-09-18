import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The portal placeholders — Orders and Assigned vehicle tracking.
 *
 * A single centred block on the navy base. No mock dashboard, no
 * screenshot of a product that does not exist, no progress bar toward a
 * date nobody has committed to. A buyer who lands here from the footer
 * should learn what the thing will do and leave with a way to reach a
 * person, which is the same outcome the real portal would produce today.
 *
 * Solid rather than glass: it sits on a flat section with nothing behind
 * it, and glass over nothing is a muddy rectangle.
 *
 * On the warm surface, because these two pages are a single short block
 * and a full navy screen for three paragraphs reads as an error state
 * rather than as something deliberately unfinished.
 */
export default function ComingSoon({
  eyebrow,
  title,
  lede,
  points,
  footnote,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  points: string[];
  footnote?: ReactNode;
}) {
  return (
    <section className="section-y section-light">
      <div className="shell" data-lift-group>
        <div className="solid mx-auto max-w-[62ch] p-10 text-center sm:p-14">
          <p className="type-mono mb-6 text-steel" data-lift>
            {eyebrow}
          </p>

          <h1 className="type-h2 text-cream" data-reveal-h1>
            {title}
          </h1>

          <p
            className="type-mono mt-6 inline-block rounded-button border border-line px-4 py-2 text-steel"
            data-lift
          >
            In development
          </p>

          <p className="mt-8 text-mist" data-lift>
            {lede}
          </p>

          <ul className="mt-10 space-y-4 border-t border-line pt-8 text-left type-body-sm text-mist">
            {points.map((point) => (
              <li key={point} className="relative pl-6" data-lift>
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.6em] h-px w-2 bg-steel"
                />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap justify-center gap-4" data-lift>
            <Link href="/contact" className="btn-base btn-filled">
              Talk to us instead
            </Link>
            <Link href="/fleet" className="btn-base btn-plain">
              See the fleet
            </Link>
          </div>

          {footnote && (
            <p className="type-mono mt-10 text-steel" data-lift>
              {footnote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
