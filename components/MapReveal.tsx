"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Draws a corridor map on as it comes into view.
 *
 * Takes the map as `children` so PakistanMap stays a server component and
 * its ~175KB of geometry never reaches the browser — this file ships, the
 * data does not.
 *
 * Everything is queried inside this component's own subtree rather than
 * by id, so a page may carry more than one of these without two maps
 * animating each other.
 *
 * GSAP is imported inside the effect: ScrollTrigger reaches for window on
 * registration, and a client component is still rendered on the server
 * for the initial HTML.
 */
export default function MapReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

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

      const { EASE, DUR, HERO, START, prefersReducedMotion } = motion;

      const q = <T extends SVGElement>(selector: string) =>
        Array.from(root.querySelectorAll<T>(selector));

      const outlines = q<SVGPathElement>("[data-map-outline] path");
      const ctxRoads = q<SVGPathElement>("[data-map-ctx] path");
      const corRoads = q<SVGPathElement>("[data-map-cor] path");
      const pulses = q<SVGPathElement>("[data-map-pulse] path");
      const nodeGs = q<SVGGElement>("[data-map-node]");
      const rings = q<SVGCircleElement>(".map-ring");
      if (!corRoads.length) return;

      /* The pulse is a short dash chased along the full corridor, so it
         needs the path's real rendered length either way. */
      const measure = (path: SVGPathElement) => {
        const len = path.getTotalLength();
        path.dataset.len = String(len);
        return len;
      };

      if (prefersReducedMotion()) {
        /* Final state, instantly, and no looping pulse. */
        gsap.set([...outlines, ...ctxRoads, ...corRoads, ...nodeGs], { opacity: 1 });
        gsap.set(pulses, { opacity: 0 });
        return;
      }

      [...corRoads, ...ctxRoads].forEach((path) => {
        const len = measure(path);
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
      });
      pulses.forEach((path) => {
        const len = measure(path);
        path.style.strokeDasharray = `40 ${len - 40}`;
        path.style.strokeDashoffset = String(len);
        path.style.opacity = "0";
      });

      gsap.set([outlines, nodeGs], { opacity: 0 });

      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(outlines, { opacity: 1, duration: HERO.outlineDuration, ease: EASE.settle }, 0)
        .to(
          ctxRoads,
          {
            strokeDashoffset: 0,
            duration: HERO.contextRoadDuration,
            ease: EASE.carry,
            stagger: HERO.contextRoadStagger,
          },
          0.1,
        )
        .to(
          corRoads,
          {
            strokeDashoffset: 0,
            duration: HERO.corridorRoadDuration,
            ease: EASE.carry,
            stagger: HERO.corridorRoadStagger,
          },
          DUR.lift,
        )
        .to(
          nodeGs,
          { opacity: 1, duration: DUR.settle, ease: EASE.settle, stagger: HERO.nodeStagger },
          DUR.carry,
        );

      const loops: gsap.core.Tween[] = [];

      /* Below 768px this is a plain draw-on: no looping pulse, which is
         the expensive part on a phone and the least visible. */
      const isNarrow = window.matchMedia("(max-width: 768px)").matches;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: START,
        once: true,
        onEnter: () => {
          timeline.play();
          if (isNarrow) return;

          /* Anonymous movement along the corridor. Nothing here names a
             vehicle, a load or a time — it marks that the lane is worked. */
          pulses.forEach((path, index) => {
            gsap.set(path, { opacity: 0.9 });
            loops.push(
              gsap.fromTo(
                path,
                { strokeDashoffset: Number(path.dataset.len) },
                {
                  strokeDashoffset: 0,
                  duration: HERO.pulseDuration,
                  ease: EASE.hold,
                  repeat: -1,
                  delay: index * HERO.pulseStaggerStep,
                },
              ),
            );
          });

          rings.forEach((ring, index) => {
            loops.push(
              gsap.to(ring, {
                attr: { r: 17 },
                opacity: 0,
                duration: HERO.ringPulseDuration,
                ease: EASE.flow,
                repeat: -1,
                delay: index * HERO.ringPulseStaggerStep,
              }),
            );
          });
        },
      });

      cleanup = () => {
        trigger.kill();
        timeline.kill();
        loops.forEach((loop) => loop.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <figure ref={rootRef} className={`m-0 ${className}`.trim()}>
      {children}
    </figure>
  );
}
