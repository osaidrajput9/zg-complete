# Zia Goods — marketing site

Next.js 16 (App Router) · React 19 · Tailwind v4 · GSAP 3.15.

Full spec: `docs/zia-prd.md`. It is the source of truth for copy, sitemap,
page structure, tokens and the content inventory. Read the relevant page
spec before building a page.

## Non-negotiable rules

These came from the client and override convenience.

1. **Every easing and duration comes from `lib/motion.js`.** No raw GSAP
   easing string or duration number anywhere else — including timeline
   position offsets and stagger values. Derive positions from `DUR.*`
   (e.g. `DUR.carry - DUR.lift`), never write `"-=0.8"`.
2. **No raw hex outside `app/globals.css`.** Tokens live in the `@theme`
   block; components use the generated utilities (`bg-navy-deep`,
   `text-cream`). **Amber is the map and nothing else** — no buttons, no
   icons, no hover states, no focus rings.

   One agreed exception, and it is the only one: `Preloader` and the home
   hero's eyebrow. The preloader *is* the map drawing itself, and the
   eyebrow sits on the map and names what the corridor is. Both are the
   map's own chrome rather than a second use of the colour. The audit
   below allows those two files and nothing else, so a third use still
   fails loudly.
3. **Page H1 uses `revealLines()`. Section headings use
   `revealLines({ scroll: true })`. Body content uses `lift()`.** Wired by
   data attributes, not by calling these directly — see Motion below.
4. **The app is wrapped in `#smooth-wrapper > #smooth-content`** and
   `initSmoothScroll()` is called exactly once, from `MotionRoot`.
5. **Every timeline needs a `prefers-reduced-motion` branch** that sets
   final state instantly. Animate transform and opacity only.
6. **Glass on floating surfaces only** — nav, its menus, cards genuinely
   over the map, form containers. Flat sections use `solid`. Never glass
   over nothing: if a card sits *beside* the map rather than over it, it
   is solid.
7. **Map traffic is never described as live.** No vehicle IDs, no
   tonnages on markers, and the word "live" appears nowhere in copy.
   (`aria-live` on a form status region is fine — it is an ARIA
   attribute, not copy, and nowhere near the map.)
8. **`PakistanMap` is reused at three scales**: `hero` (full frame),
   `inset` (About, three branches), `corridor` (service pages). One
   component, never a second map.

No overshoot easings anywhere — `back`, `elastic`, `bounce` are banned.

## Design system

`app/globals.css` is the only file holding a literal colour.

- `@theme` block → Tailwind utilities. Colour, type and spacing are the
  PRD's, unchanged.
- Viewport-dependent values (`--gutter`, `--section-pad`, `--glass-blur`)
  are plain custom properties with media queries, because `@theme` tokens
  are static.
- `@utility` definitions: `glass`, `solid`, `shell`, `section-y`,
  `type-display` / `type-h2` / `type-h3` / `type-lede` / `type-mono` /
  `type-figure`, `btn-base` / `btn-filled` / `btn-ghost` / `btn-plain`.

`DESIGN.md` (Apple HIG) applies for **non-colour guidance only** — glass
layering, voice, accessibility, component behaviour, icon consistency.
Its palette, type and spacing do not apply; the PRD's do.

From it: glass is blur + tint + **specular edge**; one filled button per
*screen* (counted by what shares a viewport — a hero CTA and a form
submit 7000px apart are fine); nav actions are never filled; disabled is
35%; every icon comes from `components/Icon.tsx` at one stroke weight;
minimum tap target 44px.

Focus rings are **mist, not amber** — rule 2 reserves amber, and mist is
the stronger contrast anyway (11.0:1 vs 6.5:1). PRD geometry kept: 2px at
3px offset. Never removed.

## Motion architecture

`lib/motion.js` is the signed-off vocabulary — **do not edit it.**

`lib/sequence.js` sits on top of it and holds what the vocabulary does
not: `MAP` (map-draw tuning, shared by all three scales), `HERO` (the home
load), and the functions that turn those into **absolute** timeline
positions — `heroBeats()`, `corridorBeats()`, `sweep()`, `withMotion()`.
Rule 1 forbids raw numbers in a component and this file forbids editing
the vocabulary; `sequence.js` is how both hold at once. It imports every
easing from `EASE` and invents none.

`lib/page.js` maps the vocabulary onto markup via data attributes:

| Attribute | Gets |
|---|---|
| `data-reveal-h1` | `revealLines()` on load |
| `data-reveal` | `revealLines({ scroll: true })` |
| `data-lift` | `lift()` |
| `data-lift-group` | stagger boundary; its `data-lift` children move together |

GSAP is **dynamically imported inside `useEffect`** everywhere. It must
never evaluate during SSR — ScrollSmoother and SplitText reach for
`window` on registration, and client components still render on the
server.

## Traps already hit — do not re-introduce

- **`lift()` is a `gsap.from`.** CSS starts `[data-lift]` at opacity 0 to
  avoid a flash, so the tween would run 0 → 0. `page.js` sets the end
  state first. Same applies to any new `from` tween on these elements.
- **Lift groups nest.** A `Section` is a group and a `ClientWall` inside
  it is another. An element must belong to exactly one or it collects two
  competing tweens and strands part-way through. Ownership is the nearest
  enclosing group.
- **The CSS minifier collapses prefixed + unprefixed `backdrop-filter`**
  written in the same rule and keeps one. The `-webkit-` form lives in
  its own `@supports` block. Merging them ships glass with no blur.
- **An external SVG in `<img>` cannot inherit `currentColor`** and renders
  black. `LogoMark` inlines it. Its `svg` needs an explicit
  `aspect-ratio` or `width: auto` collapses to 0 in a flex container.
- **`next/font` only exposes `axes` when no fixed `weight` is set.**
  Archivo loads as a variable font for the `wdth` axis.
- **Map city labels collide** where nodes sit close. `PakistanMap` flips
  the left-hand city of any crowded pair to read leftwards, measured
  against every marker rather than only the labelled ones — Faisalabad
  against Lahore, Karachi against Port Qasim.
- **Relative timeline offsets hide a data dependency.** `"-=0.4"` is
  measured from wherever the timeline ends, and the map tweens end at a
  time set by how many elements the data produced. Positions come from
  `sequence.js` as absolute seconds; the chain is written in the order
  things happen, because a relative chain cannot guarantee it.
- **`data/pakistan-map.json`'s `nodes` are hand-curated** and the build
  script passes them through untouched, so adding a city there survives
  `npm run map`. Positions are Web Mercator: `x` linear in `radians(lon)`,
  `y` linear in `ln(tan(π/4 + lat/2))`, solvable from any two nodes.

## Verifying

`npm run build` passing is not verification. Run the page in a browser —
every bug above was invisible to the build.

```
npm run build && npx next start -p 4321
```

Then check: no console errors; one `<h1>`; every `[data-lift]`,
`[data-reveal]` at opacity 1 after a slow scroll; reduced-motion context
settles everything instantly with `#smooth-content` transform `none`;
`document.documentElement.scrollWidth === window.innerWidth` at 390px;
forms validate and move focus to the first invalid field.

Grep audits that catch rule breaks:

```
grep -rnE '(duration|ease|delay|stagger|scrub)\s*:\s*("[a-z]|[0-9])' app components lib | grep -vE 'lib/motion.js|lib/sequence.js'
grep -rnE '#[0-9A-Fa-f]{6}\b' app components lib --include=*.tsx --include=*.ts | grep -v globals.css
grep -rn 'amber' app components lib | grep -vE 'PakistanMap|globals.css|Preloader|Hero.tsx'
```

The first grep misses two rule-1 breaks it reads past — a bare easing
string and a relative position are neither of them a `key: value` pair:

```
grep -rnE '"[+-]=[0-9]' app components lib
grep -rnE '"(power|sine|expo|circ|back|elastic|bounce)[0-9]?\.(in|out|inOut)"' app components lib | grep -v lib/motion.js
```

And two for the copy rules, which nothing else catches:

```
grep -rniE 'world-class|cutting-edge|seamless|revolutionis|passion|\bfuel\b' app components
grep -rniE '\blive\b' app components | grep -v aria-live
```

## Built

Every page in the PRD's sitemap now exists:

`/` (hero plus the six § Home sections), `/edible-oil-transportation`,
`/molasses-transportation`, `/containers-finished-goods`, `/fleet`,
`/about`, `/contact`, and the two portal placeholders `/orders` and
`/tracking`. Plus `robots.ts`, `sitemap.ts` and `app/api/enquiry`.

`PakistanMap` runs all three of rule 8's scales. The merge that brought
the home hero in is settled: the redirect in `app/page.tsx` is gone, there
is one map component, and the hero's colours and timings folded into
`globals.css` and `sequence.js`.

**Still confirm the working tree before planning** rather than trusting
this list:

```
find app -name 'page.tsx' | sort
```

## Remaining

No pages. What is left is the launch blockers below, and the PRD's open
questions — per-type fleet counts, transit times, business hours, the
telephone number, the head-office street address, which banks to name,
and whether photography exists. All of those ship visibly marked pending
today; none of them block a page, all of them block launch.

## Working rules

One page per turn. Show the plan before writing files. Verify in a
browser, not on a green build.

## Launch blockers

- **The enquiry endpoint has no mailbox.** `app/api/enquiry/route.ts`
  validates and routes, but sending needs `RESEND_API_KEY`,
  `ENQUIRY_FROM` and `ENQUIRY_TO` (optionally `ENQUIRY_TO_EDIBLE_OIL`,
  which PRD § Routing wants separated). Unconfigured it logs the whole
  enquiry server-side and returns 503, so the form tells the buyer to
  call rather than claiming a success that did not happen. **Nothing is
  silently lost, but nothing is being received either.** Swapping Resend
  for another provider is one function, `deliver()`.
- **Indexing is off.** `robots.ts` disallows everything unless
  `NEXT_PUBLIC_ALLOW_INDEXING=true`. Set it on production at launch and
  not before.
- `NEXT_PUBLIC_SITE_URL` should be set per environment, or canonicals on
  a preview deployment point at production. Defaults to the production
  domain when unset.

## Copy rules

Operational, specific, unhurried. Numbers rather than adjectives. Never
the word "fuel" — they carry edible oil, molasses and chemicals, not
petroleum. Banned: world-class, cutting-edge, seamless, revolutionising,
passion.

Anything the PRD lists as an open question ships **visibly marked
pending** — transit times, per-type fleet counts, business hours, the
telephone number. Never invent a figure to fill a gap.
