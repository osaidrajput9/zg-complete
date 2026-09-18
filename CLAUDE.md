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
`lib/page.js` maps it onto markup via data attributes:

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
- **Map city labels collide** where nodes sit close. `CITY` entries take
  `side: "left"`; the further-left city of a close pair reads leftwards.

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
grep -rnE '(duration|ease|delay|stagger|scrub)\s*:\s*("[a-z]|[0-9])' app components lib | grep -v lib/motion.js
grep -rnE '#[0-9A-Fa-f]{6}\b' app components lib --include=*.tsx --include=*.ts | grep -v globals.css
grep -rn 'amber' app components lib | grep -v 'PakistanMap\|globals.css'
```

## Built

`/edible-oil-transportation`, `/molasses-transportation`, `/fleet` and
`/contact` were built here. The signed-off home hero was built separately
and merged in afterwards.

Because the hero arrived from outside this history, **confirm the working
tree before planning** rather than trusting this list:

```
find app -name 'page.tsx' | sort
grep -rn 'redirect' app/page.tsx
grep -rln 'svg' components | grep -i map
```

Three things the merge may have left to settle:

- `app/page.tsx` held a redirect to the edible oil page as a stand-in for
  the missing home page. If it is still there it shadows the real home —
  delete it.
- If the hero brought its own map, nav or glass CSS, reconcile rather than
  keep both. Rule 8 allows one map component at three scales, and
  `scale="hero"` had never been rendered before the merge, so check it at
  full frame.
- Any colour, font loading or easing the hero carried must fold into
  `app/globals.css` and `lib/motion.js`. Run the grep audits above.

## Remaining, in order

1. Containers and finished goods — third service page, corridor map
2. About — 1991 onward, `PakistanMap scale="inset"` for three branches
3. Orders — placeholder, coming-soon block, no mock UI
4. Assigned vehicle tracking — placeholder, same treatment
5. Home sections below the hero, if the merge did not bring them — four
   checks a day, what we move, dedicated stainless steel, fleet at a
   glance, client wall, enquiry block (PRD § Home)

## Working rules

One page per turn. Show the plan before writing files. Verify in a
browser, not on a green build.

## Launch blockers

- **The enquiry form has no endpoint.** It POSTs to `/api/enquiry`, which
  does not exist, so every enquiry fails with the error state. Needs a
  route handler and an email sender. This is the highest-priority gap on
  a site whose job is producing enquiries.
- No `robots.ts` / `sitemap.ts`. The PRD requires both, and robots should
  block indexing until the site is complete.
- `metadataBase` is hardcoded to `https://ziagoods.com`.

## Copy rules

Operational, specific, unhurried. Numbers rather than adjectives. Never
the word "fuel" — they carry edible oil, molasses and chemicals, not
petroleum. Banned: world-class, cutting-edge, seamless, revolutionising,
passion.

Anything the PRD lists as an open question ships **visibly marked
pending** — transit times, per-type fleet counts, business hours, the
telephone number. Never invent a figure to fill a gap.
