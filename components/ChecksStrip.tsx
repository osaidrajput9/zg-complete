"use client";

import { useEffect, useRef } from "react";

/**
 * Four checks a day — the proof behind the hero.
 *
 * Each card counts up to its own ordinal and fills a rule underneath, so
 * the strip accumulates left to right: one check, two, three, four. The
 * rule is a scaleX on a transform origin, not a width, because rule 5
 * keeps entrances to transform and opacity.
 *
 * There are no clock times here on purpose. The PRD has the number of
 * checks confirmed and business hours listed as an open question, and a
 * plausible-looking 09:00 would be a figure invented to fill a gap.
 */

const CHECKS = [
  {
    title: "Position, from the trackers",
    body: "Four independent tracking providers cover the fleet. The first check of the day reconciles what they report against where the vehicle is supposed to be.",
  },
  {
    title: "The driver, by phone",
    body: "A tracker says where a vehicle is. It does not say whether the driver has a problem, is waiting on a weighbridge, or has been turned away at a gate.",
  },
  {
    title: "Against the schedule",
    body: "Progress is measured against the run as it was planned, so a delay is noticed while there is still time to tell the customer about it.",
  },
  {
    title: "Before the day closes",
    body: "The last check sets up the next one: where the vehicle has stopped, what is left of the route, and what the morning has to pick up.",
  },
];

export default function ChecksStrip() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, motion] = await Promise.all([
        import("gsap"),
        import("@/lib/motion"),
      ]);
      if (cancelled) return;

      const { EASE, DUR, START, STAGGER, countUp, prefersReducedMotion } = motion;

      const figures = Array.from(root.querySelectorAll<HTMLElement>("[data-check]"));
      const rules = Array.from(root.querySelectorAll<HTMLElement>("[data-rule]"));

      if (prefersReducedMotion()) {
        figures.forEach((el) => {
          el.textContent = el.dataset.check ?? "0";
        });
        gsap.set(rules, { scaleX: 1 });
        return;
      }

      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });

      const tweens: gsap.core.Tween[] = [];
      figures.forEach((figure) => {
        const tween = countUp(figure, Number(figure.dataset.check), {
          scroll: true,
          trigger: root,
        });
        if (tween) tweens.push(tween as gsap.core.Tween);
      });

      const fill = gsap.to(rules, {
        scaleX: 1,
        duration: DUR.carry,
        ease: EASE.carry,
        stagger: STAGGER,
        scrollTrigger: { trigger: root, start: START, once: true },
      });
      tweens.push(fill);

      cleanup = () => {
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={rootRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {CHECKS.map((check, index) => (
        <div key={check.title}>
          <p className="type-figure m-0 text-cream">
            <span data-check={index + 1}>0</span>
          </p>

          {/* The accumulating rule. Its track is the line; the fill is what
              scales, so nothing reflows as it grows. */}
          <div className="mt-6 h-px w-full bg-line" aria-hidden="true">
            <div data-rule className="h-px w-full origin-left bg-mist" />
          </div>

          <h3 className="type-h3 mt-6 text-cream">{check.title}</h3>
          <p className="mt-4 type-body-sm text-mist">{check.body}</p>
        </div>
      ))}
    </div>
  );
}
