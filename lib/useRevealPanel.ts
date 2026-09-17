"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Animates a disclosure panel open and closed.
 *
 * Menus are Snap — fast, precise, mechanical. Both the easing and the
 * duration come from motion.js; neither is written here. GSAP is imported
 * inside the effect so it never loads during server rendering.
 */
export function useRevealPanel(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
) {
  const mounted = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* On the first pass just settle the initial state — there is nothing
       to animate from yet. */
    if (!mounted.current) {
      mounted.current = true;
      node.hidden = !open;
      return;
    }

    let cancelled = false;

    (async () => {
      const [{ gsap }, { EASE, DUR, prefersReducedMotion }] = await Promise.all([
        import("gsap"),
        import("@/lib/motion"),
      ]);
      if (cancelled || !ref.current) return;
      const el = ref.current;

      if (prefersReducedMotion()) {
        el.hidden = !open;
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      if (open) {
        el.hidden = false;
        gsap.fromTo(
          el,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: DUR.snap, ease: EASE.snap },
        );
      } else {
        gsap.to(el, {
          opacity: 0,
          y: -8,
          duration: DUR.snap,
          ease: EASE.snap,
          onComplete: () => {
            el.hidden = true;
          },
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, ref]);
}
