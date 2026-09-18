import { YEARS_OPERATING } from "@/lib/site";
import HeroMotion from "@/components/HeroMotion";
import PakistanMap from "@/components/PakistanMap";
import Preloader from "@/components/Preloader";

/* All four are the fleet page's figures, not a second set: a visitor who
   reads 49 here and 49 there is reading one company. Every one traces to
   a value the client has confirmed — the last used to be a count of the
   amber roads on the map behind it, which was true of our own drawing
   rather than of anything the client supplied.

   Counted up by HeroMotion, which reads `data-to` off each figure. */
const STATS = [
  { to: 49, label: ["Company-owned", "vehicles"] },
  { to: 40, label: ["On annual", "contract"] },
  { to: YEARS_OPERATING, label: ["Years on", "the road"] },
  { to: 10, label: ["Stainless steel", "tankers"] },
];

/**
 * Home hero.
 *
 * The preloader draws Pakistan as a dot field, counts to 100, and fades
 * into a hero whose map is the same dot field in the same place — so the
 * country never redraws, the headline arrives around it.
 *
 * Nothing here carries the sitewide `data-lift` / `data-reveal` hooks:
 * HeroMotion owns this sequence end to end, and an element caught by both
 * would collect two competing tweens.
 */
export default function Hero() {
  return (
    <>
      <Preloader />

      <div
        className="hero relative flex min-h-screen flex-col justify-end pb-[max(var(--gutter),34px)] pt-[calc(var(--gutter)+72px)] opacity-0"
        id="hero"
        style={{ minHeight: "100svh" }}
      >
        <PakistanMap scale="hero" />

        <div className="shell relative z-[2]">
          <div className="max-w-[600px]">
            <p className="eyebrow type-mono mb-5 flex items-center gap-[10px] text-amber">
              <i className="h-px w-[26px] bg-amber opacity-70" />
              Nationwide coverage
            </p>

            <h1 className="type-display mb-6 text-cream">
              <span className="ln block overflow-hidden">
                <span className="block">From berth to</span>
              </span>
              <span className="ln block overflow-hidden">
                <span className="block">refinery gate.</span>
              </span>
            </h1>

            <p className="sub type-lede mb-8 max-w-[50ch] text-mist">
              Bulk edible oil moved on contract across Pakistan&apos;s motorway and
              national highway network, from Port Qasim to every major refining
              centre.
            </p>

            <div className="actions mb-11 flex flex-wrap gap-3">
              <a className="btn-base btn-filled" href="/contact">
                Request capacity
              </a>
              <a className="btn-base btn-ghost" href="/edible-oil-transportation#routes">
                See our network
              </a>
            </div>

            <dl className="stats grid max-w-[620px] grid-cols-4 gap-[26px] border-t border-line pt-5 max-[900px]:grid-cols-2 max-[900px]:gap-5">
              {STATS.map((stat) => (
                <div key={stat.label.join(" ")}>
                  <dd
                    className="num mb-[6px] text-[29px] font-semibold tracking-[-0.02em] text-cream tabular-nums"
                    data-to={stat.to}
                  >
                    0
                  </dd>
                  <dt className="type-mono leading-[1.4] text-steel">
                    {stat.label[0]}
                    <br />
                    {stat.label[1]}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <HeroMotion />
    </>
  );
}
