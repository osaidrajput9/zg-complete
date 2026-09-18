"use client";

import { useEffect, useRef } from "react";
import { Check } from "@/components/Icon";

/**
 * Weight readout — two values plus the matched mark.
 *
 * The argument the page rests on, stated as a measurement rather than a
 * promise: what went on at the loading weighbridge, what came off at the
 * discharge weighbridge, and the fact that they agree.
 *
 * The figure is the PRD's assumed typical load and is not yet confirmed
 * by the client, which is why the copy calls it typical.
 */
export default function WeightReadout({
  load = 31.4,
  discharge = 31.4,
}: {
  load?: number;
  discharge?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const matched = load === discharge;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, motion, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("@/lib/motion"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      const { EASE, DUR, START, countUp, prefersReducedMotion } = motion;
      const values = root.querySelectorAll<HTMLElement>("[data-weight]");
      const mark = root.querySelector<HTMLElement>("[data-mark]");
      const format = (value: number) => value.toFixed(2);

      if (prefersReducedMotion()) {
        values.forEach((el) => {
          el.textContent = format(Number(el.dataset.weight));
        });
        if (mark) gsap.set(mark, { opacity: 1, y: 0 });
        return;
      }

      if (mark) gsap.set(mark, { opacity: 0, y: 12 });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: START,
        once: true,
        onEnter: () => {
          values.forEach((el) => countUp(el, Number(el.dataset.weight), { format }));

          /* The mark lands after both figures have settled — the point is
             that they agree, so it cannot arrive before they are
             readable. */
          if (mark) {
            gsap.to(mark, {
              opacity: 1,
              y: 0,
              duration: DUR.lift,
              ease: EASE.lift,
              delay: DUR.carry,
            });
          }
        },
      });

      cleanup = () => trigger.kill();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [load, discharge]);

  return (
    <div ref={rootRef} className="solid p-8">
      <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <p className="type-mono mb-4 text-steel">At load · weighbridge</p>
          <p className="type-figure flex items-baseline gap-[2px] text-cream">
            <span data-weight={load}>0.00</span>
            <span className="text-[0.4em] tracking-normal text-steel">t</span>
          </p>
        </div>

        <div className="h-px w-full self-stretch bg-line sm:h-auto sm:w-px" aria-hidden="true" />

        <div>
          <p className="type-mono mb-4 text-steel">At discharge · weighbridge</p>
          <p className="type-figure flex items-baseline gap-[2px] text-cream">
            <span data-weight={discharge}>0.00</span>
            <span className="text-[0.4em] tracking-normal text-steel">t</span>
          </p>
        </div>
      </div>

      <p
        data-mark
        className="type-mono mt-6 inline-flex items-center gap-2 rounded-button border border-line-strong px-4 py-2 text-cream"
      >
        <Check size={15} />
        <span>{matched ? "Matched" : "Variance recorded"}</span>
      </p>

      <p className="mt-6 max-w-[48ch] text-[0.9375rem] text-steel">
        A typical tanker load, captured at both ends and recorded against the
        consignment. Figures shown are representative of a standard run.
      </p>
    </div>
  );
}
