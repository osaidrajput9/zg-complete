"use client";

import { useEffect, useRef } from "react";

/**
 * Stat strip — four figures that count up as they come into view.
 *
 * The counter is Carry: a long steady travel, which is the right feel for
 * a number arriving at its final value. Both the easing and the duration
 * come from motion.js.
 */
export default function StatStrip({
  stats,
}: {
  stats: { value: number; label: string; note?: string; prefix?: string }[];
}) {
  const rootRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const tweens: gsap.core.Tween[] = [];

    (async () => {
      const { countUp, prefersReducedMotion } = await import("@/lib/motion");
      if (cancelled) return;

      const figures = root.querySelectorAll<HTMLElement>("[data-stat]");

      figures.forEach((figure) => {
        const to = Number(figure.dataset.stat);

        /* countUp writes the final value straight in when motion is
           reduced, so there is no separate branch to write here — but
           there is also no ScrollTrigger to create. */
        const tween = countUp(figure, to, {
          scroll: !prefersReducedMotion(),
          trigger: root,
        });
        if (tween) tweens.push(tween as gsap.core.Tween);
      });
    })();

    return () => {
      cancelled = true;
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [stats]);

  return (
    <dl
      ref={rootRef}
      className="grid grid-cols-1 gap-8 border-y border-line py-10 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="type-mono mb-4 text-steel">{stat.label}</dt>
          <dd className="m-0">
            <span className="type-figure text-cream">
              {stat.prefix}
              <span data-stat={stat.value}>0</span>
            </span>
            {stat.note && (
              <span className="mt-4 block type-body-sm text-mist">{stat.note}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
