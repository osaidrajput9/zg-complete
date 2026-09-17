"use client";

import { useEffect } from "react";

/**
 * Starts smooth scroll and wires the page's entrance motion.
 *
 * Both modules are imported dynamically inside the effect so GSAP never
 * loads during server rendering — ScrollSmoother and SplitText reach for
 * window on registration, and a client component is still rendered on the
 * server for the initial HTML.
 *
 * Mounted once, from the root layout.
 */
export default function MotionRoot() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [{ initSmoothScroll }, { initPage }] = await Promise.all([
        import("@/lib/motion"),
        import("@/lib/page"),
      ]);
      if (cancelled) return;

      initSmoothScroll();
      initPage();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
