/**
 * page.js — wires the motion vocabulary onto markup.
 *
 * Every value used here comes from motion.js. This file contains no
 * easing string and no duration number; it only decides WHICH preset a
 * piece of markup gets:
 *
 *   data-reveal-h1   the page H1        → revealLines()
 *   data-reveal      a section heading  → revealLines({ scroll: true })
 *   data-lift        body content       → lift()
 *   data-lift-group  a stagger boundary → its [data-lift] children move
 *                                          together, triggered off the group
 *
 * Headings start at opacity 0 (under .js only, so a page without
 * JavaScript still renders) and are switched on once their lines are
 * already masked, which removes the flash between paint and split.
 */

import { gsap } from "gsap";
import { revealLines, lift, prefersReducedMotion } from "./motion.js";

function reveal(el, options) {
  /* gsap.from renders its start state immediately, so by the time this
     returns the lines are already hidden behind their masks and the
     heading can be switched on without showing anything. */
  revealLines(el, options);
  gsap.set(el, { opacity: 1 });
}

/* lift() is a gsap.from, so it animates towards whatever opacity the
   element currently has. The CSS starts it at 0 to avoid a flash, which
   would otherwise make the tween run 0 → 0 and never appear. The end
   state is set first; both calls land in the same frame, so the
   from-tween's immediate render puts it straight back to hidden without
   anything being painted in between. */
function liftIn(items, trigger) {
  if (!items.length) return;
  gsap.set(items, { opacity: 1 });
  lift(items, { trigger });
}

/* Groups nest — a Section is a group and a ClientWall inside it is
   another. An element must belong to exactly one, or it collects two
   competing tweens that fight and strand it part-way through. Ownership
   goes to the nearest enclosing group. */
function ownedBy(group) {
  return [...group.querySelectorAll("[data-lift]")].filter(
    (el) => el.closest("[data-lift-group]") === group,
  );
}

function wire() {
  document.querySelectorAll("[data-reveal-h1]").forEach((el) => reveal(el, {}));

  document
    .querySelectorAll("[data-reveal]")
    .forEach((el) => reveal(el, { scroll: true }));

  /* Grouped content staggers against its own container, so a section low
     on the page does not fire off a trigger at the top of it. */
  document.querySelectorAll("[data-lift-group]").forEach((group) => {
    liftIn(ownedBy(group), group);
  });

  /* Anything outside a group rises on its own. */
  document.querySelectorAll("[data-lift]").forEach((el) => {
    if (el.closest("[data-lift-group]")) return;
    liftIn([el], el);
  });
}

export function initPage() {
  if (prefersReducedMotion()) {
    /* Final state, instantly. Nothing is left hidden behind a mask or a
       trigger that will never fire. */
    gsap.set("[data-reveal-h1], [data-reveal]", { opacity: 1 });
    gsap.set("[data-lift]", { opacity: 1, y: 0 });
    return;
  }

  /* Splitting before the webfont lands measures the wrong line breaks. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(wire);
  } else {
    wire();
  }
}
