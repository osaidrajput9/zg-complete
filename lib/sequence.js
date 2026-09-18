/**
 * sequence.js — the two hand-built sequences on this site.
 *
 * `lib/motion.js` is the signed-off vocabulary and is not edited. This
 * file sits on top of it and holds what the vocabulary deliberately does
 * not: the tuning specific to drawing the map and to the home page's
 * load, and the arithmetic that turns both into absolute positions on a
 * timeline.
 *
 * It exists so that no raw duration, easing or timeline position appears
 * in a component — which is what the motion rule is actually protecting —
 * without the signed-off vocabulary growing a section that belongs to one
 * page. Nothing here invents an easing: every ease the sequences use
 * comes from `EASE` in motion.js.
 *
 * Positions are absolute, never `"-=0.4"`. A relative offset is measured
 * from wherever the timeline happens to end, which makes every beat a
 * function of the one before it and hides what is actually being said.
 *
 * The copy does still follow the map, and that is the design: the words
 * arrive once the country has drawn, so a faster map should mean earlier
 * words rather than a finished map nobody is reading yet. What changed is
 * that the relationship is now stated — and bounded, so a denser rebuild
 * of `data/pakistan-map.json` cannot push the headline past its ceiling.
 */

import { DUR, STAGGER, prefersReducedMotion } from "./motion.js";

/* ------------------------------------------------------------------ *
 * 1. Drawing the map
 *
 * Shared by the hero's full-frame map and the corridor diagrams on the
 * service pages, so a change to how a road draws changes it everywhere
 * the map is used.
 * ------------------------------------------------------------------ */

export const MAP = {
  dotStagger:           0.0006,
  outlineDuration:      0.8,
  contextRoadDuration:  1.6,
  contextRoadStagger:   0.012,
  corridorRoadDuration: 1.8,
  corridorRoadStagger:  0.02,
  nodeStagger:          0.07,
  pulseDuration:        7,
  pulseStaggerStep:     0.9,
  ringPulseDuration:    3.4,
  ringPulseStaggerStep: 0.8,
};

/* ------------------------------------------------------------------ *
 * 2. The home page's load
 *
 * Either side of the map: the preloader that draws the country, and the
 * copy that arrives around it once it is drawn.
 * ------------------------------------------------------------------ */

export const HERO = {
  preloaderDotStagger:    0.00055,
  preloaderCountDuration: 3.1,
  preloaderFadeDuration:  0.6,
  headlineDuration:       0.8,
  statCountDuration:      1.3,
};

/* ------------------------------------------------------------------ *
 * 3. Positions
 * ------------------------------------------------------------------ */

/**
 * How long a staggered set takes end to end: the last element starts at
 * (n - 1) * each, and then runs for its own duration.
 *
 * This is the number a relative offset hides. Naming it is what lets the
 * beats below stay put when the element count changes.
 */
export function sweep(count, each, duration) {
  return Math.max(count - 1, 0) * each + duration;
}

/**
 * The home page's load sequence, as absolute positions in seconds.
 *
 * Counts are passed in because they come from the rendered map rather
 * than from this file. The sweeps are therefore measured; every overlap
 * between them is a design decision taken from the vocabulary. So the
 * sequence tracks the map it is drawing, and the only thing the data can
 * move is how long the country takes to light — within the cap below.
 */
export function heroBeats({ dots, contextRoads, corridorRoads, headlineLines }) {
  /* The country's sweep is the one quantity here set by the data rather
     than by the design: it is the dot count times the stagger. The
     sequence plans against a capped value, because a denser rebuild must
     not leave someone looking at a finished map waiting for the headline.
     The ceiling is the preloader's own count plus a carry — the reveal
     should not run much longer than the preload it followed. At the
     current 5,819 dots the sweep is under the cap and nothing is
     clamped. */
  const countrySweepMax = HERO.preloaderCountDuration + DUR.carry;
  const dotSweep = Math.min(
    sweep(dots, MAP.dotStagger, DUR.lift),
    countrySweepMax,
  );
  const contextSweep = sweep(contextRoads, MAP.contextRoadStagger, MAP.contextRoadDuration);
  const corridorSweep = sweep(corridorRoads, MAP.corridorRoadStagger, MAP.corridorRoadDuration);
  const headlineSweep = sweep(headlineLines, STAGGER, HERO.headlineDuration);

  /* The preloader fades and the hero surfaces underneath it, so the two
     cross rather than cut. */
  const veil = 0;
  const hero = HERO.preloaderFadeDuration - DUR.snap;

  /* The country lights while the hero is still arriving, and the boundary
     closes over the dot field as its sweep ends. */
  const country = hero + DUR.snap / 2;
  const outline = country + dotSweep - DUR.snap;

  /* The network draws: context roads first, the corridor overlapping them
     so it is still moving when the roads behind it settle. */
  const context = outline + MAP.outlineDuration - DUR.lift;
  const corridor = context + contextSweep - DUR.carry;

  /* The words arrive a settle after the corridor starts, while the route
     is still drawing — the headline lands on a moving map rather than a
     finished one. Tied to the corridor, which is the thing it is landing
     on, rather than to the last city marker, which is where the relative
     offsets had put it by accident. */
  const headline = corridor + DUR.settle;

  /* Markers land as the corridor finishes, and the pulse picks up a
     settle before it does, so the route is never briefly static. */
  const nodes = corridor + corridorSweep - (DUR.settle + DUR.lift);
  const pulse = corridor + corridorSweep - DUR.settle;

  /* The supporting copy ladders in behind the headline, and the figures
     start counting just before the block they sit in finishes rising. */
  const sub = headline + headlineSweep + DUR.snap / 2;
  const actions = sub + STAGGER * 2;
  const stats = actions + STAGGER * 2;
  const statCount = stats + DUR.lift - DUR.snap / 2;

  return {
    veil,
    hero,
    country,
    outline,
    context,
    corridor,
    headline,
    nodes,
    pulse,
    sub,
    actions,
    stats,
    statCount,
  };
}

/**
 * A corridor diagram's draw-on, as absolute positions. Same shape as the
 * hero's map beats, at the scale a service page uses.
 */
export function corridorBeats() {
  const outline = 0;
  const context = outline + MAP.outlineDuration - DUR.settle;
  const corridor = context + DUR.lift;
  const nodes = corridor + DUR.carry - DUR.lift;

  return { outline, context, corridor, nodes };
}

/* ------------------------------------------------------------------ *
 * 4. Reduced motion
 *
 * The presets in motion.js each handle this themselves. These two
 * sequences are hand-built timelines rather than presets, so they need a
 * final state spelled out.
 * ------------------------------------------------------------------ */

export function withMotion(buildTimeline, applyFinalState) {
  if (prefersReducedMotion()) {
    applyFinalState?.();
    return null;
  }
  return buildTimeline();
}
