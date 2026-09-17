"use client";

import { useEffect } from "react";

/**
 * Renders nothing. It drives the home page's load sequence for markup
 * that Preloader, PakistanMap and Hero rendered on the server, selecting
 * by id so the ~175KB of map geometry stays out of the client bundle.
 *
 * GSAP is imported inside the effect, like everywhere else on this site:
 * ScrollSmoother and SplitText reach for window when motion.js registers
 * them, and a client component is still rendered on the server for the
 * initial HTML.
 */
export default function HeroMotion() {
  useEffect(() => {
    const pre = document.getElementById("pre");
    const hero = document.getElementById("hero");
    if (!pre || !hero) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, motion] = await Promise.all([
        import("gsap"),
        import("@/lib/motion"),
      ]);
      if (cancelled) return;

      const { DUR, EASE, HERO, LIFT_Y, STAGGER, withMotion } = motion;

      const q = <T extends Element>(selector: string) =>
        gsap.utils.toArray<T>(selector);

      const preDots = q<SVGCircleElement>("#pre-dots circle");
      const mapDots = q<SVGCircleElement>("#m-dots circle");
      const outlines = q<SVGPathElement>("#m-outline path");
      const ctxRoads = q<SVGPathElement>("#m-ctx path");
      const corRoads = q<SVGPathElement>("#m-cor path");
      const haloRoads = q<SVGPathElement>("#m-halo path");
      const bloomRoads = q<SVGPathElement>("#m-bloom path");
      const pulses = q<SVGPathElement>("#m-pulse path");
      const nodeGs = q<SVGGElement>("#m-nodes > g");
      const rings = q<SVGCircleElement>("#m-nodes .map-ring");
      const headlineSpans = q<HTMLElement>("#hero h1 .ln span");
      const numEls = q<HTMLElement>("#hero .num");
      const softEnter = ["#hero .sub", "#hero .actions", "#hero .stats"];

      /* Path-length setup needs real rendered geometry, so it happens here
         even though the paths themselves are server-rendered. */
      [corRoads, haloRoads, bloomRoads, ctxRoads].forEach((set) =>
        set.forEach((p) => {
          const len = p.getTotalLength();
          p.dataset.len = String(len);
          p.style.strokeDasharray = String(len);
          p.style.strokeDashoffset = String(len);
        }),
      );
      pulses.forEach((p) => {
        const len = p.getTotalLength();
        p.dataset.len = String(len);
        p.style.strokeDasharray = `40 ${len - 40}`;
        p.style.strokeDashoffset = String(len);
        p.style.opacity = "0";
      });

      const tweens: gsap.core.Tween[] = [];
      let timeline: gsap.core.Timeline | undefined;

      const countTo = (el: HTMLElement, duration: number) => {
        const proxy = { v: 0 };
        tweens.push(
          gsap.to(proxy, {
            v: Number(el.dataset.to),
            duration,
            ease: EASE.carry,
            onUpdate: () => {
              el.textContent = String(Math.round(proxy.v));
            },
          }),
        );
      };

      const pulseFlow = () => {
        pulses.forEach((p, i) => {
          const len = Number(p.dataset.len);
          gsap.set(p, { opacity: 0.9 });
          tweens.push(
            gsap.fromTo(
              p,
              { strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration: HERO.pulseDuration,
                ease: EASE.hold,
                repeat: -1,
                delay: i * HERO.pulseStaggerStep,
              },
            ),
          );
        });
        rings.forEach((ring, i) => {
          tweens.push(
            gsap.to(ring, {
              attr: { r: 17 },
              opacity: 0,
              duration: HERO.ringPulseDuration,
              ease: EASE.flow,
              repeat: -1,
              delay: i * HERO.ringPulseStaggerStep,
            }),
          );
        });
      };

      const applyFinalState = () => {
        pre.style.display = "none";
        gsap.set(hero, { opacity: 1 });
        gsap.set([mapDots, outlines, nodeGs], { opacity: 1 });
        [corRoads, haloRoads, bloomRoads, ctxRoads].forEach((set) =>
          gsap.set(set, { strokeDashoffset: 0 }),
        );
        gsap.set(headlineSpans, { yPercent: 0 });
        gsap.set(softEnter, { opacity: 1, y: 0 });
        numEls.forEach((el) => {
          el.textContent = el.dataset.to ?? "0";
        });
      };

      const reveal = () => {
        timeline = gsap
          .timeline()
          .to(pre, {
            opacity: 0,
            duration: HERO.preloaderFadeDuration,
            ease: EASE.veil,
            onComplete: () => {
              pre.style.display = "none";
            },
          })
          .to(hero, { opacity: 1, duration: DUR.lift, ease: EASE.lift }, "-=0.4")
          .to(
            mapDots,
            {
              opacity: 1,
              duration: DUR.lift,
              ease: EASE.lift,
              stagger: { each: HERO.mapDotStagger, from: "start" },
            },
            "-=0.3",
          )
          .to(
            outlines,
            { opacity: 1, duration: HERO.outlineDuration, ease: EASE.settle },
            "-=0.4",
          )
          .to(
            ctxRoads,
            {
              strokeDashoffset: 0,
              duration: HERO.contextRoadDuration,
              ease: EASE.carry,
              stagger: HERO.contextRoadStagger,
            },
            "-=0.5",
          )
          .to(
            [bloomRoads, haloRoads, corRoads],
            {
              strokeDashoffset: 0,
              duration: HERO.corridorRoadDuration,
              ease: EASE.carry,
              stagger: HERO.corridorRoadStagger,
            },
            "-=1.2",
          )
          .to(
            nodeGs,
            { opacity: 1, duration: DUR.settle, ease: EASE.settle, stagger: HERO.nodeStagger },
            "-=1.1",
          )
          .to(
            headlineSpans,
            { yPercent: 0, duration: HERO.headlineDuration, ease: EASE.lift, stagger: STAGGER },
            "-=1.6",
          )
          .to("#hero .sub", { opacity: 1, y: 0, duration: DUR.lift, ease: EASE.lift }, "-=0.5")
          .to("#hero .actions", { opacity: 1, y: 0, duration: DUR.lift, ease: EASE.lift }, "-=0.35")
          .to("#hero .stats", { opacity: 1, y: 0, duration: DUR.lift, ease: EASE.lift }, "-=0.35")
          .add(() => numEls.forEach((el) => countTo(el, HERO.statCountDuration)), "-=0.2")
          .add(pulseFlow, "-=1.0");
      };

      withMotion(() => {
        gsap.set(mapDots, { opacity: 0 });
        gsap.set(outlines, { opacity: 0 });
        gsap.set(nodeGs, { opacity: 0 });
        gsap.set(headlineSpans, { yPercent: 110 });
        gsap.set(softEnter, { opacity: 0, y: LIFT_Y });

        /* The country draws itself in, dot by dot, over the count. */
        tweens.push(
          gsap.to(preDots, {
            opacity: 0.9,
            duration: DUR.lift,
            ease: EASE.lift,
            stagger: { each: HERO.preloaderDotStagger, from: "start" },
          }),
        );

        const numEl = document.getElementById("pre-num");
        const fill = document.getElementById("pre-fill");
        const prog = { v: 0 };

        tweens.push(
          gsap.to(prog, {
            v: 100,
            duration: HERO.preloaderCountDuration,
            ease: EASE.carry,
            onUpdate: () => {
              if (numEl) numEl.textContent = String(Math.round(prog.v)).padStart(2, "0");
              if (fill) fill.style.right = `${100 - prog.v}%`;
            },
            onComplete: reveal,
          }),
        );

        return null;
      }, applyFinalState);

      cleanup = () => {
        timeline?.kill();
        tweens.forEach((tween) => tween.kill());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
