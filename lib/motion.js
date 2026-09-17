/**
 * motion.js — the single source of truth for movement on this site.
 *
 * Requires gsap@3.13+ (SplitText and ScrollSmoother are free from 3.13).
 *   npm install gsap@latest
 *
 * Rule: no GSAP easing string or duration number appears anywhere else
 * in the codebase. Every component imports from here.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

/* ------------------------------------------------------------------ *
 * 1. The vocabulary
 * ------------------------------------------------------------------ */

export const EASE = {
  settle: "power2.out",   // arrives with weight, stops clean — the default
  snap:   "power4.out",   // fast and precise — user-triggered things
  carry:  "power1.inOut", // long steady travel — large objects
  lift:   "power2.out",   // small rise into place — text, cards
  flow:   "sine.inOut",   // viscous, looping — map traffic, breathing states
  hold:   "none",         // no easing of its own — scroll-scrubbed only
  veil:   "power2.inOut", // cross-dissolve — preloader handing off to hero
};

export const DUR = {
  settle: 0.6,
  snap:   0.4,
  carry:  1.2,
  lift:   0.5,
  flow:   5,
  reveal: 0.9,   // masked line reveal — slower than a plain lift
};

export const STAGGER = 0.08;
export const LINE_STAGGER = 0.09;   // between masked lines
export const LIFT_Y = 30;
export const START = "top 80%";

gsap.defaults({ ease: EASE.settle, duration: DUR.settle });

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Build a timeline, or skip straight to the state it would have ended in.
   Every entrance in this file handles reduced motion itself; this is for
   the hero's load sequence, which is one long hand-built timeline rather
   than a preset and has a final state worth spelling out. */
export function withMotion(buildTimeline, applyFinalState) {
  if (prefersReducedMotion()) {
    applyFinalState?.();
    return null;
  }
  return buildTimeline();
}

/* ------------------------------------------------------------------ *
 * 2. Fluidity — smooth scroll
 *
 * Call once, from the layout, after the DOM is ready. Markup must be:
 *   <div id="smooth-wrapper"><div id="smooth-content"> … </div></div>
 *
 * smooth: 1.2 is deliberate. Higher feels like the page is fighting
 * the user; lower loses the effect. Do not exceed 1.5.
 * ------------------------------------------------------------------ */

let smoother = null;

export function initSmoothScroll() {
  if (prefersReducedMotion()) return null;
  if (window.matchMedia("(max-width: 768px)").matches) return null; // native scroll on mobile
  if (smoother) return smoother;

  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,
    effects: true,          // enables data-speed / data-lag attributes
    normalizeScroll: true,
    ignoreMobileResize: true,
  });
  return smoother;
}

/* The live instance, for the rare caller that needs to pause scrolling —
   the preloader holds the page still while it is over the hero. Null
   until initSmoothScroll has run, and on mobile and reduced motion,
   where there is no smoother and native scrolling applies. */
export function getSmoother() {
  return smoother;
}

/* Parallax without writing a tween: <div data-speed="0.9"> moves slower,
   data-speed="1.1" faster. Keep between 0.85 and 1.15 — beyond that it
   reads as a gimmick rather than depth. */

/* ------------------------------------------------------------------ *
 * 3. Masked line reveal — the opening text effect
 *
 * Splits into lines, wraps each in a clipping mask, slides each line up
 * from below its own mask. This is what reads as "expensive" — the text
 * appears to be uncovered rather than to fly in.
 *
 * Usage:
 *   revealLines(".hero h1")                    // on load
 *   revealLines(".about h2", { scroll: true }) // on scroll into view
 * ------------------------------------------------------------------ */

export function revealLines(target, options = {}) {
  const els = gsap.utils.toArray(target);
  if (!els.length) return null;

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1 });
    return null;
  }

  const timelines = els.map((el) => {
    const split = new SplitText(el, {
      type: "lines",
      linesClass: "line",
      mask: "lines",           // gsap 3.13 — creates the clipping wrapper for you
    });

    const tl = gsap.from(split.lines, {
      yPercent: 115,
      duration: options.duration ?? DUR.reveal,
      ease: options.ease ?? EASE.lift,
      stagger: options.stagger ?? LINE_STAGGER,
      delay: options.delay ?? 0,
      paused: !!options.scroll,
      onComplete: () => {
        if (options.revert !== false) split.revert();   // restore clean DOM for a11y
      },
    });

    if (options.scroll) {
      ScrollTrigger.create({
        trigger: options.trigger ?? el,
        start: options.start ?? START,
        once: true,
        onEnter: () => tl.play(),
      });
    }

    return tl;
  });

  return timelines;
}

/* Word-level variant — use sparingly, and only on short display text.
   A whole paragraph revealed word by word is unreadable and slow. */
export function revealWords(target, options = {}) {
  const els = gsap.utils.toArray(target);
  if (!els.length || prefersReducedMotion()) {
    gsap.set(els, { opacity: 1 });
    return null;
  }

  return els.map((el) => {
    const split = new SplitText(el, { type: "words", mask: "words" });
    return gsap.from(split.words, {
      yPercent: 110,
      duration: 0.7,
      ease: EASE.lift,
      stagger: options.stagger ?? 0.03,
      delay: options.delay ?? 0,
    });
  });
}

/* ------------------------------------------------------------------ *
 * 4. Standard entrances
 * ------------------------------------------------------------------ */

export function lift(targets, options = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return null;

  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0 });
    return null;
  }

  return gsap.from(els, {
    opacity: 0,
    y: options.distance ?? LIFT_Y,
    duration: DUR.lift,
    ease: EASE.lift,
    stagger: options.stagger ?? STAGGER,
    scrollTrigger: {
      trigger: options.trigger ?? els[0],
      start: options.start ?? START,
      once: true,
    },
  });
}

export function flow(targets, toVars, options = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length || prefersReducedMotion()) return null;

  return gsap.to(els, {
    ...toVars,
    duration: options.duration ?? DUR.flow,
    ease: EASE.flow,
    repeat: -1,
    yoyo: options.yoyo ?? true,
    delay: options.offset ?? 0,
  });
}

export function countUp(el, to, options = {}) {
  const node = typeof el === "string" ? document.querySelector(el) : el;
  if (!node) return null;

  const format = options.format ?? ((v) => Math.round(v).toLocaleString());

  if (prefersReducedMotion()) {
    node.textContent = format(to);
    return null;
  }

  const obj = { v: options.from ?? 0 };
  return gsap.to(obj, {
    v: to,
    duration: options.duration ?? 1.3,
    ease: EASE.carry,
    onUpdate: () => { node.textContent = format(obj.v); },
    scrollTrigger: options.scroll ? {
      trigger: options.trigger ?? node,
      start: START,
      once: true,
    } : undefined,
  });
}

export function scrubbed(trigger, options = {}) {
  return {
    trigger,
    start: options.start ?? "top center",
    end: options.end ?? "bottom center",
    scrub: options.scrub ?? 1,
  };
}

/* ------------------------------------------------------------------ *
 * 5. Hero load sequence
 *
 * Durations and stagger steps for the home page's preloader-to-hero
 * hand-off and the corridor pulse loop that runs after it. These are not
 * part of the sitewide vocabulary above — they are one sequence, tuned
 * against itself — but they live here so that no raw number appears in a
 * component.
 * ------------------------------------------------------------------ */

export const HERO = {
  preloaderDotStagger:   0.00055,
  preloaderCountDuration: 3.1,
  preloaderFadeDuration:  0.6,
  mapDotStagger:         0.0006,
  outlineDuration:       0.8,
  contextRoadDuration:   1.6,
  contextRoadStagger:    0.012,
  corridorRoadDuration:  1.8,
  corridorRoadStagger:   0.02,
  nodeStagger:           0.07,
  headlineDuration:      0.8,
  statCountDuration:     1.3,
  pulseDuration:         7,
  pulseStaggerStep:      0.9,
  ringPulseDuration:     3.4,
  ringPulseStaggerStep:  0.8,
};

/* ------------------------------------------------------------------ *
 * 6. Housekeeping
 * ------------------------------------------------------------------ */

if (typeof document !== "undefined") {
  if (document.fonts) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  });
}
