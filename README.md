# Zia Goods & Carriage Contractor

Marketing site for a bulk liquid haulage company operating across Pakistan
since 1991. Next.js 16 (App Router), Tailwind v4, GSAP.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run map        # rebuild data/pakistan-map.json — see scripts/map-data-inputs.md
```

## What this repo is

It compiles two earlier repositories into one site.

| From | What came across |
| --- | --- |
| `ZG` | The home hero, the preloader, and the Pakistan map — `components/Hero.tsx`, `HeroMotion.tsx`, `Preloader.tsx`, `PakistanMap.tsx`, `data/pakistan-map.json`, the map build scripts, and the brand asset set |
| `zgwhole` | Everything else — the design system in `app/globals.css`, the nav and footer, the service, fleet and contact pages, the motion library, and the PRD in `docs/` |

`zgwhole` deliberately shipped its home page as a redirect, with a note that
the hero was signed off and being built separately. That hero is what `ZG`
held. This repo puts them together.

## How the two fit

**The home page is the hero.** The preloader draws Pakistan as a dot field,
counts to 100, and hands the same coordinates to the hero map, so the country
never redraws — the headline arrives around it. `HeroMotion` owns that whole
sequence and selects by id, which keeps the ~175KB of geometry out of the
client bundle.

**One map, two variants.** `ZG`'s real-geometry map replaced `zgwhole`'s
schematic one, so the site draws Pakistan once rather than in two visual
languages. `variant="hero"` is the full frame behind the headline;
`variant="corridor"` is the inline diagram on a service page, which drops the
dot field and the corridor bloom — both are hero-scale effects that turn to
mush at 520px. Service pages pass the cities that service calls at, so three
pages sharing one motorway spine still read differently.

**One motion vocabulary.** `ZG`'s `motion.ts` folded into `zgwhole`'s
`lib/motion.js`, which was already the superset. The hero's own timings live
there as `HERO`, so no raw duration appears in a component. `HeroMotion` was
converted from `@gsap/react`'s `useGSAP` to the dynamic-import-inside-an-effect
pattern the rest of the site uses, which also drops a dependency.

**The hero's figures are the fleet page's figures.** `ZG`'s hero carried its
own set (22 tankers, 20 years) that contradicted the fleet page. They now read
49 company-owned, 40 on annual contract, 35 years, and 6 core corridors — the
last being the six amber roads on the map directly behind them.

## Known gaps

Carried over from `zgwhole`, not introduced here:

- The nav and footer link to `/containers-finished-goods`, `/tracking`,
  `/about` and `/orders`, which do not exist yet and 404.
- Telephone numbers and the head-office street address are placeholders
  pending client confirmation.
- Transit times on the service pages read "to be confirmed".
- The map data has no Sargodha node, so the edible oil corridor draws as far
  as Faisalabad while the leg list beside it names Sargodha.
