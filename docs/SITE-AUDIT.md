# Zia Goods — site audit specification

Run this against the whole site. Every check is pass/fail — no "looks fine".
Report as a table: check ID, page(s) affected, pass/fail, and for each fail,
the file and line.

Fix in severity order. Do not fix P3 items while P0 items are open.

Severity:
- **P0** — factually wrong, broken, or damages credibility. Blocks launch.
- **P1** — visibly unfinished or off-system. Blocks client review.
- **P2** — quality and consistency.
- **P3** — polish.

---

## A. Factual accuracy (P0)

The source material contains contradictions. These are the settled values.
Anything else in the codebase is superseded and must be corrected, not kept
alongside.

| ID | Check | Correct value |
| --- | --- | --- |
| A1 | Founding year appears only as 1991 | 1991 — not 2001, not 2019, not "over 18 years" |
| A2 | Years operating is consistent with 1991 | 34 years |
| A3 | Company-owned vehicle count | 49 |
| A4 | Contracted vehicle count | 40 |
| A5 | Common carriers | ~10 |
| A6 | Stainless steel tankers | 10, dedicated to edible oil |
| A7 | Driver checks per day | 4 |
| A8 | Independent tracking providers | 4 |
| A9 | Branches named correctly | Karachi head office, Port Qasim site office, Sargodha Punjab branch |

**A10 — No tonnage-per-month figure anywhere.** The "million tonnes" figure does
not survive division by the fleet size and must not appear in any form until
reframed and confirmed. Grep for: `million`, `tonnes per`, `tons per`, `MT/`.

**A11 — No invented statistics.** Every number on the site traces to the table
above or to client-supplied data. Flag any percentage, count or figure that
doesn't. Common offenders: "98% on-time", "500+ clients", "24/7 support",
"99.9% safety record".

**A12 — Client names spelled as supplied.** Dalda Foods, Habib Oil Mills, Unity
Foods, Spring Edible Oil Mills, Shujabad Agro Industries, Universal Edible Oil,
Shareef Extraction Plant, Shareef Ghee Mill Kundri, Sahib Oil Trader Hyderabad,
M.A Oil, Gulzar Foods, Fatima Sugar Mills, Reliance Commodities, Al Rahim
Trading, Pakistan Molasses, United Ethanol Industries, Bulk Management, Madina
Sugar Mills, National Refinery, Biotech Energy, National Petrocarbon, Power
Chemical Industries, Pakistan Terminal Operators, Ali Corporation, Synergy
Packaging, Rasool Group of Companies.

---

## B. Brand rules (P0)

| ID | Check | Grep for |
| --- | --- | --- |
| B1 | The word "live" never describes map traffic | `live`, `real-time`, `realtime` |
| B2 | No vehicle IDs or tonnages attached to map markers | `ZG-`, `data-vehicle`, marker labels |
| B3 | The word "fuel" is not used for cargo | `fuel`, `fuelling`, `fueling` |
| B4 | Company name is "Zia Goods" or "Zia Goods & Carriage Contractor" | `Xirvo`, `ProjectOZ` |
| B5 | No superlatives from the old profile | `world-class`, `cutting-edge`, `seamless`, `revolutioni`, `state-of-the-art`, `best-in-class` |

**B6 — Theft is handled by implication, not named.** The site says "weights
verified at load and discharge". It does not say "zero theft" or "no pilferage".
Grep for: `theft`, `pilfer`, `stolen`.

---

## C. Content completeness (P1)

**C1 — No placeholder text anywhere.** Grep for: `lorem`, `ipsum`, `TODO`,
`TBD`, `FIXME`, `placeholder`, `Coming soon` (except on the two placeholder
pages), `Your text here`, `xxx`, `###`.

**C2 — No empty sections.** Any section element whose only children are a
heading, or which renders under 40 words of body copy, is a fail.

**C3 — Every page has a real H1** containing its target term.

**C4 — Every page has a written meta description**, 140-160 characters, not
generated from the first paragraph and not duplicated between pages.

**C5 — No broken internal links.** Every `href` starting `/` resolves.

**C6 — No placeholder images.** Grep for: `via.placeholder`, `placehold.co`,
`unsplash`, `picsum`, `dummyimage`.

**C7 — Every service page carries all its specified sections.** Per the PRD:
hero, cargo detail, fleet relevance, verified weights, tracking, routes,
clients in that vertical, carriage contracting, enquiry form.

**C8 — Placeholder pages look intentional.** Orders and Assigned Vehicle
Tracking: a single centred block, a sentence on what the portal will do, a route
back to the enquiry form. No mock dashboards, no fake screenshots, no empty
tables.

---

## D. Design system compliance (P1)

**D1 — No raw hex in any component.** Grep for `#` followed by 3, 4, 6 or 8 hex
characters outside `tokens.css`. Every colour comes from a token.

**D2 — Tokens match the system.**

```
--navy:       #011F7B
--navy-deep:  #011246
--cream:      #F8F1E4
--mist:       #D8E3FF
--amber:      #E8A33D
--steel:      #6C7FB5
```

**D3 — `#2457FF` appears nowhere.** It was dropped; it measures 2.6:1 against
the new navy and is invisible.

**D4 — `#111C44` appears nowhere.** Superseded by `#011F7B`.

**D5 — Amber appears only in map components.** Grep for `--amber` and
`#E8A33D` — any hit outside a map component or a focus ring is a fail.

**D6 — Glass treatment only on floating surfaces.** Nav, cards over the map,
form containers. Any `backdrop-filter` on a section with a flat background is a
fail — those use solid `navy-deep`.

**D7 — Glass is consistent where used.** Same blur, saturation, border and
shadow values everywhere. No one-off variants.

**D8 — Typography follows the scale.** Archivo for text, IBM Plex Mono only for
data (tonnages, timestamps, road refs, eyebrow labels). Mono used decoratively
is a fail.

**D9 — Radius is 4px, buttons 2px.** No other values.

---

## E. Motion compliance (P1)

**E1 — No raw GSAP easing strings outside `motion.js`.** Grep for:
`power1`, `power2`, `power3`, `power4`, `sine.`, `expo.`, `circ.`, `"none"` in a
tween.

**E2 — No raw durations.** Any `duration:` with a bare number outside
`motion.js` is a fail.

**E3 — No overshoot easings anywhere.** Grep for: `back.`, `elastic`, `bounce`.
These are banned — overshoot reads as imprecision.

**E4 — Every timeline has a reduced-motion branch.** Any `gsap.timeline()` or
`gsap.to/from` not reachable through `withMotion`, `matchMedia` or a
`prefersReducedMotion` guard is a fail.

**E5 — Only transform and opacity are animated.** Grep tweens for `width`,
`height`, `top`, `left`, `margin`, `padding` — all fails.

**E6 — Stagger is 0.08** unless the component spec says otherwise.

**E7 — Entrances rise from below**, 30px, one direction sitewide.

**E8 — Entrances fire once.** No `once: false`, no re-animation on scroll back.

**E9 — H1s use `revealLines()`.** Section headings use
`revealLines({ scroll: true })`.

**E10 — ScrollSmoother mounted once** in the layout, with the
`#smooth-wrapper` / `#smooth-content` markup present. Off below 768px and under
reduced motion.

---

## F. Accessibility (P1)

**F1 — Heading order is sequential.** One H1 per page, no skipped levels.

**F2 — Focus visible on every interactive element.** 2px amber, 3px offset.
Grep for `outline: none` and `outline: 0` without a replacement.

**F3 — Every image has alt text** describing the subject. Fleet images name the
vehicle type. Decorative images use `alt=""` plus `aria-hidden="true"`.

**F4 — Map is `aria-hidden`** where decorative, or keyboard-navigable with
labels where interactive. Not half of each.

**F5 — Form inputs have associated labels**, not placeholder-only.

**F6 — Colour contrast passes AA.** Body text 4.5:1, large text 3:1. Check
`--steel` on `--navy` in particular — it measures ~3.4:1 and must not be used for
body copy.

**F7 — Keyboard traverses the whole page** in visual order, including the nav
and the form.

**F8 — `prefers-reduced-motion` produces a complete, readable page.** Toggle it
and verify nothing is stuck at opacity 0.

---

## G. SEO (P2)

**G1 — Title tags written per page**, under 60 characters, containing the target
term.

**G2 — Target terms map correctly:**

| Page | Term |
| --- | --- |
| Home | carriage contractor Pakistan |
| Edible oil | edible oil transportation Pakistan |
| Molasses | molasses transportation |
| Fleet | HTV transport services |
| Containers | container transport Pakistan |

**G3 — "cooking oil" appears in body copy** on the edible oil page, at least
twice. Consumer phrasing gets searched alongside trade phrasing.

**G4 — Schema.org LocalBusiness** present, with both addresses.

**G5 — `sitemap.xml` and `robots.txt` exist** and are correct.

**G6 — No duplicate meta descriptions** across pages.

**G7 — Canonical URLs set.**

---

## H. Technical (P2)

**H1 — No console errors or warnings** on any page.

**H2 — No 404s** on assets, fonts or internal links.

**H3 — Map data loaded from `src/data/`**, not inlined in a component.

**H4 — Preloader runs once per session**, via `sessionStorage`, wrapped in
try/catch. Not on every page navigation.

**H5 — Fonts preconnected and `display=swap`.**

**H6 — Enquiry form submits somewhere real** and shows success and error states.

**H7 — Responsive at 390px, 768px, 1280px and 1920px.** Report any horizontal
overflow — check `document.documentElement.scrollWidth > window.innerWidth`.

**H8 — 1280px specifically:** the hero panel must not obscure the map corridor.
This is the known tight breakpoint.

---

## I. Polish (P3)

**I1 — Consistent spacing rhythm.** Section padding 112px desktop, 64px mobile.

**I2 — Tabular figures on all numbers** — `font-variant-numeric: tabular-nums`.

**I3 — No orphaned words** in headings at common breakpoints.

**I4 — Hover states on every interactive element**, 0.25s, Snap easing.

**I5 — Favicon and OG image set.**

**I6 — 404 page designed**, not the framework default.

---

## Reporting format

```
| ID | Page | Status | File:line | Note |
| A1 | /about | FAIL | src/pages/about.astro:34 | "since 2001" |
```

After the table, list the P0 and P1 fails as an ordered fix list. Do not begin
fixing until I have reviewed the report.
