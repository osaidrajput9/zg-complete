import mapData from "@/data/pakistan-map.json";

const { viewBox, dots } = mapData as unknown as {
  viewBox: string;
  dots: [number, number, number?][];
};

/**
 * The first thing the site does is draw the country.
 *
 * The dot field lights up in place here and then hands the same
 * coordinates over to the hero map, so the country does not redraw — it
 * stays put while everything else arrives around it. Both read from
 * data/pakistan-map.json.
 *
 * Sits above the nav (z-50) and the skip link (z-100) rather than beside
 * them: until the count reaches 100 this is the whole page.
 *
 * Sized `h-[100svh] w-full` rather than `inset-0`. ScrollSmoother
 * transforms #smooth-content, and a transformed ancestor becomes the
 * containing block for the fixed elements inside it — so `inset-0` would
 * resolve against the full document height and centre the dot field
 * somewhere down the page instead of in the viewport.
 *
 * Server component: 5,819 coordinates render to HTML here and none of the
 * JSON reaches the browser.
 */
export default function Preloader() {
  return (
    <div
      id="pre"
      className="fixed left-0 top-0 z-[200] flex h-[100svh] w-full flex-col items-center justify-center bg-navy"
    >
      <svg
        id="pre-svg"
        viewBox={viewBox}
        aria-hidden="true"
        className="h-auto max-h-[62vh] w-[min(52vw,46vh)]"
      >
        <g id="pre-dots">
          {dots.map(([x, y], i) => (
            <circle key={i} className="pre-dot" cx={x} cy={y} r="1.7" />
          ))}
        </g>
      </svg>

      <div id="pre-read" className="mt-[26px] flex items-baseline gap-[14px]">
        <span
          id="pre-num"
          className="font-mono text-[44px] font-medium tracking-[-0.02em] text-cream tabular-nums"
        >
          00
        </span>
        <span id="pre-lbl" className="type-mono text-amber">
          Mapping network
        </span>
      </div>

      <div id="pre-bar" className="relative mt-[16px] h-px w-[min(280px,54vw)] bg-line-strong">
        <i id="pre-fill" className="absolute inset-y-0 left-0 right-full block bg-amber" />
      </div>
    </div>
  );
}
