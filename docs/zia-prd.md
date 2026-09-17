# Zia Goods — website product requirements

2026-09-17 · @u_XDZjeqIWf38YfcUgSo2EOw

## Overview

A marketing site for Zia Goods & Carriage Contractor, a bulk liquid haulage company operating since 1991 from Karachi, with a site office at Port Qasim and a branch in Sargodha.

The business moves edible oil (raw and refined), molasses, chemicals and finished oil products in containers, nationwide, for oil mills, sugar and molasses producers, chemical plants, feed mills and soap manufacturers.

### Who it is for

A procurement or logistics manager at a mill choosing between carriers. Sceptical, price-aware, and usually burned before by short deliveries or contaminated loads. They arrive with one question: can these people move my product, on my route, without losing any of it.

### What it has to achieve

1. Establish credibility inside thirty seconds - years operating, named clients, real fleet numbers.
2. Differentiate on integrity rather than price. Verified weights and dedicated stainless steel capacity are arguments no competitor is making.
3. Produce quotable enquiries, not just contact details.

### Scope

Nine pages. Seven are full marketing pages. Orders and Assigned Vehicle Tracking are placeholders with a coming-soon state - they stand for a client portal that is a separate phase with its own budget, designed as a promise rather than a product.

The homepage hero is already built in code and is not being redesigned. Everything below it, and every other page, is in scope.

## Brand and proposition

The promise has two halves, and both are needed. Coverage alone is a commodity claim; integrity alone sounds defensive.

**We go everywhere. Nothing goes missing.**

Coverage is the nationwide motorway and highway network, 49 company-owned vehicles and 40 more on annual contract. Integrity is two things working together: weights verified at load and again at discharge, and stainless steel tankers dedicated to edible oil so nothing is carried in a tank that last held something else.

### Why this and not something else

Pilferage and contamination are the structural problems in Pakistani bulk liquid haulage. Product siphoned in transit, short weights at the discharge weighbridge, disputes the buyer cannot prove. None of the named competitors addresses it on their site.

Zia Goods already runs an operation built against it - an in-house tracking department that contacts every driver four times a day, contracts with four independent tracking providers, weighbridge readings captured at both ends. The site's job is to name what they already do.

### Tone

Operational, specific, unhurried. Numbers rather than adjectives. The reader is a professional buyer who has heard every superlative in the category and discounts all of them.

Avoid: world-class, cutting-edge, seamless, revolutionising, passion. The existing company profile leans on these; the site should not.

### What the site never claims

- Never describes the map traffic as live. Movement on the map is an anonymous diagram of an active network, not a feed. No vehicle IDs, no tonnages attached to markers, and the word live appears nowhere near it.
- Never states a tonnage-per-month figure until one is confirmed that survives arithmetic.
- Never uses the word fuel. The current tagline says fuelling Pakistan's logistics; they carry edible oil, molasses and chemicals, not petroleum, and to a refinery buyer that word points the wrong way.

## Design system

### Colour

| Token | Hex | Role | Contrast on base |
| --- | --- | --- | --- |
| navy | #011F7B | Base surface, dominant | - |
| navy-deep | #011246 | Section alternation, footer | - |
| cream | #F8F1E4 | Primary text, primary buttons | 12.6:1 |
| mist | #D8E3FF | Secondary text, links, borders | 11.0:1 |
| amber | #E8A33D | Accent - map only | 6.5:1 |
| steel | #6C7FB5 | Muted labels, context roads | 3.4:1 |

**The previous secondary blue #2457FF is dropped.** Against #011F7B it measures about 2.6:1 and effectively disappears. Mist takes over link and interactive-state duty.

**Amber appears on the map and nowhere else.** It measures 6.5:1 on navy but only 1.9:1 on cream, so it cannot be used for text on light surfaces even if someone wants to. That constraint is useful: it makes the corridor the single warm thing on the site and prevents the accent being diluted across buttons and icons.

The navy is close to the logo blue, so the mark sits on the background without a container.

### Typography

**Archivo**, variable, with the width axis. It is a grotesque with real weight available, it has genuine tabular figures - necessary on a site full of tonnages and fleet counts - and its semi-expanded widths echo the squarish geometry of the ZG mark without imitating it.

| Use | Setting |
| --- | --- |
| Display / H1 | Archivo 700, semi-expanded, -0.025em, line-height 1.02 |
| H2 | Archivo 600, -0.022em, line-height 1.1 |
| H3 | Archivo 600, -0.015em |
| Body | Archivo 400, 16-17px, line-height 1.6 |
| Data and labels | IBM Plex Mono 400-500, 10-12px, letter-spacing 0.1em |

Mono is reserved for things that are literally data - tonnages, timestamps, road refs, eyebrow labels. Not for decoration.

Alternatives if Archivo feels too neutral: Schibsted Grotesk has more character at heavy weights; Host Grotesk is squarer and closer to the logo. Both are on Google Fonts.

### Glass

Committed, not mixed. Every floating surface gets the same treatment.

```
background: rgba(1, 31, 123, .55);
backdrop-filter: blur(18px) saturate(160%);
border: 1px solid rgba(216, 227, 255, .12);
border-radius: 4px;
box-shadow: 0 8px 32px rgba(1, 10, 45, .38);
```

Applies to: the floating nav, the hero panel, section cards, form containers, the fleet cards. Blur drops to 14px below 1000px for performance.

Glass only works over something worth seeing through to. On flat sections with no map behind, use a solid `navy-deep` surface with the same border and radius instead - not glass over nothing.

### Spacing and grid

- Max content width 1320px, gutters 44px desktop, 22px mobile
- Section padding 112px vertical desktop, 64px mobile
- Radius 4px everywhere except buttons at 2px
- Borders are always `rgba(216, 227, 255, .12)`, never a solid grey

## Motion vocabulary

Six named presets, defined once in `src/lib/motion.js`. No component contains a raw easing string or duration number. Designs reference these by name.

| Name | Feel | Easing | Duration | Used for |
| --- | --- | --- | --- | --- |
| Settle | Arrives with weight, stops clean | power2.out | 0.6s | Default for almost everything |
| Snap | Fast, precise, mechanical | power4.out | 0.4s | Menus, filters, anything clicked |
| Carry | Long steady travel | power1.inOut | 1.2s | Large objects crossing the viewport |
| Lift | Small rise into place | power2.out | 0.5s | Text lines, cards, list items |
| Flow | Viscous, continuous, looping | sine.inOut | 5s loop | Map traffic, breathing states |
| Hold | No easing, tied to scroll | none | scrub 1 | Scrubbed sequences, counters |

### Global rules

- Stagger between siblings is 0.08s. Below 0.05 they read as one block; above 0.12 the last feels late.
- Entrances rise 30px from below. One direction sitewide.
- Nothing exceeds 1.2s unless it is scroll-scrubbed.
- Entrances fire once, at `top 80%`. No replay on scroll back.
- Hover transitions are 0.25s, Snap.
- Page transitions are a plain 0.4s fade. Novelty here costs perceived speed.

### Non-negotiable

No overshoot easings anywhere. `back`, `elastic` and `bounce` are banned. A tanker carries 30 tonnes; nothing on this site should feel springy, and overshoot reads as imprecision on a site selling precision.

Every timeline needs a `prefers-reduced-motion` branch that sets final states instantly. Animate transform and opacity only.

Below 768px: no scrub-pinned sequences, no parallax, map simplified to a static draw-on-enter. Entrances stay.

## Sitemap

| Page | Purpose | Priority |
| --- | --- | --- |
| Home | Establish the two-part promise and route to the right service | 1 |
| Edible oil transportation | Primary service page. Raw and refined, SS tanker story | 1 |
| Molasses transportation | Second service page. Low-competition search term | 1 |
| Fleet | Vehicle types by category, the credibility page | 1 |
| Contact | Quotable enquiry capture | 1 |
| Containers and finished goods | Dry cargo, 20ft and 40ft beds, half bodies | 2 |
| About | 1991 onward, branches, how the operation runs | 2 |
| Orders | Placeholder, coming soon | 3 |
| Assigned vehicle tracking | Placeholder, coming soon | 3 |

Navigation carries six items: Services (dropdown to the three service pages), Fleet, Tracking, About, Contact, and a Request a quote button. Orders and Assigned Vehicle Tracking sit in the footer only until they are real.

Carriage contracting is not a page. It is a cross-cutting offer that appears as a section on each service page, because a buyer searching for a specific cargo type converts better on a page about that cargo than on a page about contract structures.

## Page specifications

### Home

Hero is built. Sections below it, in order:

1. **Four checks a day** - the tracking department, four time cards counting up on scroll with a progress rule filling under each. This is the proof behind the hero's claim.
2. **What we move** - three cards routing to the service pages. Edible oil, molasses, containers and finished goods. Fill-based blocks, not floating cards with shadows.
3. **Dedicated stainless steel** - short section, the food-grade capability. Ten SS tankers, edible oil only, never rotated onto chemicals or molasses.
4. **Fleet at a glance** - 49 owned, 40 contracted, 10 common carriers, linking to the Fleet page.
5. **Client wall** - 35 names, typographic, no logos needed. Hover brightens.
6. **Enquiry block** - the form, or a strong route to it.

### Edible oil transportation

The most important page on the site. Structure:

- Hero: static, no map. Headline naming the cargo directly for search.
- Raw versus refined - what each needs, and why refined goes in stainless steel.
- The SS fleet: 10 dedicated tankers, what dedicated means, why it matters for contamination.
- Verified weights: the load-and-discharge process, stated as procedure not promise.
- Routes: Port Qasim inland, the corridor, typical transit times.
- Clients in this vertical: Dalda, Habib Oil Mills, Unity Foods, Spring Edible Oil Mills, Shujabad Agro, Universal Edible Oil, Shareef Extraction, M.A Oil, Gulzar Foods.
- Carriage contracting offer.
- Enquiry form, pre-set to edible oil.

### Molasses transportation

Same skeleton, different content. MS tankers, 10/18/22 wheelers. Clients: Fatima Sugar Mills, Reliance Commodities, Pakistan Molasses, United Ethanol, Al Rahim Trading, Bulk Management, Madina Sugar Mills. Emphasis on handling characteristics and sugar-mill seasonality.

### Containers and finished goods

20ft and 40ft container beds, 18 and 22 wheelers, half bodies. Packed oil products, finished goods. Clients: Synergy Packaging, Bake Parlour, Rasool Group.

### Fleet

The credibility page. A table by vehicle category, then a section per category with what it carries and why.

| Category | Types | Carries |
| --- | --- | --- |
| MS oil tankers | 10, 18, 22 wheeler | Raw edible oil, chemicals, molasses |
| By-product tankers | 10 wheeler, separate | By-product, kept apart from food-grade |
| SS tankers | 10 units | Refined edible oil only, dedicated |
| Container beds | 20ft, 40ft | Finished goods, packed oil |
| Flatbeds | 18, 22 wheeler | General freight |
| Half bodies | - | Part loads, shorter runs |

Per-unit counts are still needed from the client for every row except SS.

Below the table: HTV only, the tracking arrangement, maintenance standards.

### About

1991 onward. Karachi head office, Port Qasim site office, Sargodha branch - shown on a simplified version of the map component. How the tracking department works. Banking relationships as a credibility signal. No founder photography unless it exists and is good.

### Contact

Form as the primary element, not an afterthought below a map. Address, phone, email alongside. Site office and head office both listed with their roles labelled.

### Orders and Assigned Vehicle Tracking

Placeholder pages. Each carries a short description of what the portal will do, a coming-soon state, and a route back to the enquiry form. Designed to look intentional rather than unfinished - a single centred block on the navy base, no fake dashboards, no mock screenshots.

## Component library

| Component | Where | Notes |
| --- | --- | --- |
| Floating nav | Every page | Frosted, pinned 16px from top, max 1320px, six links plus quote button |
| Hero panel | Home | Frosted, built |
| Page hero | All interior pages | Solid navy-deep, eyebrow + H1 + lede, no map |
| Pakistan map | Home, About, service pages | One component, three scales: full hero, inset, simplified |
| Weight readout | Home hero, edible oil page | Two values plus matched mark |
| Time card | Home | Number, label, description, filling rule |
| Service card | Home, cross-links | Fill-based, no shadow, hover shifts fill |
| Fleet row | Fleet page | Category, types, carries, count |
| Client wall | Home, service pages | Typographic chips, filterable by vertical on service pages |
| Enquiry form | Contact, every service page | Seven fields, four required |
| Stat strip | Home, About, Fleet | Four figures, counts up on scroll |
| Coming-soon block | Orders, Tracking | Centred, single block, no mock UI |
| Footer | Every page | Two addresses, contact, page links, Orders and Tracking here |

The map is the piece worth building once and reusing. Full-frame in the home hero, inset at half width on About showing the three branches, simplified on service pages showing only that service's corridor.

### States that need designing

Empty, loading and error states for the enquiry form. Hover and focus-visible for every interactive element - focus rings are 2px amber at 3px offset, and they must not be removed. Mobile nav, since the desktop nav collapses below 1000px.

## Content inventory

### Confirmed figures

| Figure | Value | Source |
| --- | --- | --- |
| Founded | 1991 | Client, confirmed |
| Company-owned vehicles | 49 | Company profile |
| On annual contract | 40 | Company profile |
| Common carriers | \~10 | Company profile |
| SS tankers | 10, dedicated to edible oil | Client, confirmed |
| Driver checks per day | 4 | Company profile |
| Tracking providers | 4 | Company profile |
| Typical tanker load | 31.4t, assumed | Not yet confirmed |

The company profile contains conflicting founding dates (1991, 2001, over 18 years) and fleet counts (25 owned, 45 owned, 49 owned). 1991 and 49 are the agreed figures. Every other instance in source material should be treated as superseded.

### Branches

- Karachi - head office
- Port Qasim - site office, Plot 290 Main National Highway Razzakabad, Bin Qasim
- Sargodha - Punjab branch

### Clients, by vertical

**Edible oil** - Dalda Foods, Habib Oil Mills, Unity Foods, Spring Edible Oil Mills, Shujabad Agro Industries, Universal Edible Oil, Shareef Extraction Plant, Shareef Ghee Mill Kundri, Sahib Oil Trader Hyderabad, M.A Oil, Gulzar Foods

**Molasses** - Reliance Commodities, Fatima Sugar Mills, Al Rahim Trading, Pakistan Molasses, United Ethanol Industries, Bulk Management, Madina Sugar Mills

**Chemical** - Biotech Energy, National Petrocarbon, Power Chemical Industries, National Refinery, Pakistan Terminal Operators, Ali Corporation

**Feed mills** - China Pakistan Feeds Lahore, Master Feeds, Sohna Feeds, Ishan Feeds, GS Feeds, Apex Feeds, A One Feeds, Model Poultry Products, Hashmi Feeds Mirpurkhas

**Soap mills** - Azhar Soap Corporation, Punjab Soap Factory, Sethi Soap Islamabad, Tanveer Soap Karachi, Mukhtiar Soap Karachi, Barkat Soap Faisalabad, Shan Soap Factory Lahore, Pakistan Soap Factory Sahiwal, Dilawer Soap Karachi, Yaqoob Soap Multan, Hoor Soap Multan, Khan Soap Factory

**Logistics and packaging** - Fatima Group of Industries, Synergy Packaging, Bake Parlour, Rasool Group of Companies

Publication permission is granted.

### Tracking partners

MegaTech Trackers, Bizintel, iTchnologi Group / Falcon-i, Tracking World.

### Contact

M. Zeeshan Malik. ziagoodsncarriage@gmail.com. A company-domain email address would read better than Gmail on a site selling reliability - worth raising.

## Forms and conversion

### Enquiry form

| Field | Type | Required |
| --- | --- | --- |
| Name | Text | Yes |
| Company name | Text | Yes |
| Telephone | Tel | Yes |
| Email | Email | No |
| What are you moving | Select: edible oil, molasses, chemicals, containers, other | No |
| Route | Text, origin and destination | No |
| Volume and frequency | Text | No |

The client asked for four fields. The last three are added because name and number tells you who is asking but nothing about what they want, which means every enquiry costs a phone call before it can be quoted. All three are optional, so the form stays short and nobody is blocked.

Email is deliberately optional. In this market plenty of buyers will give a mobile number and never check email. Telephone is the required channel.

When the form appears on a service page, the cargo select is pre-filled to that page's cargo.

### Routing

Edible oil enquiries flag for whoever handles food-grade and SS capacity. Everything else goes to general dispatch. Worth confirming who those people are.

### Secondary conversion

A phone number in the nav on mobile, tap to call. In this category a significant share of enquiries will come by phone regardless of what the form does, and burying the number costs leads.

## SEO

| Target term | Page | Note |
| --- | --- | --- |
| edible oil transportation Pakistan | Edible oil | Primary commercial term |
| cooking oil transport Pakistan | Edible oil | Consumer phrasing, use in body copy |
| molasses transportation | Molasses | Low competition, strong client proof |
| carriage contractor Pakistan | Home | The company's own category term |
| B2B transport services Pakistan | Home | Broad, low intent |
| HTV transport services | Fleet | Regulatory phrasing buyers actually use |
| bulk liquid tanker transport | Home, Fleet | Category term |
| stainless steel tanker edible oil | Edible oil | Very low competition, high intent |

Use edible oil in headings and cooking oil in body copy - trade phrasing and consumer phrasing both get searched, and both should appear.

HTV is worth using literally. It is how Pakistani buyers and regulators describe the vehicle class, and competitors write around it.

The stainless steel term is the most valuable line in this table. Almost nobody is competing for it, and anyone searching it is a refined-oil buyer with an immediate need.

### Technical

One H1 per page containing the target term. Meta descriptions written per page, not generated. Schema.org LocalBusiness with both addresses. Sitemap and robots. Alt text on every fleet image describing the vehicle type.

## Open questions

None of these block design. All of them block launch.

- [ ] Per-type fleet counts. How many MS tankers at each wheel configuration, how many container beds, how many half bodies. The Fleet page table has a column it cannot fill without this.
- [ ] Typical and maximum tanker load in tonnes. Currently assumed at 31.4t for the weight readout.
- [ ] A defensible tonnage-per-month figure, correctly labelled. The million-tonne figure does not survive division by 22 tankers and must not appear until it is reframed.
- [ ] Highest-volume routes, so the map corridor reflects reality rather than the assumed Karachi to Sargodha spine.
- [ ] alziagroup.com versus ziagoods.com. One brand with two domains, or two businesses. This document assumes Zia Goods only.
- [ ] Who receives edible oil enquiries versus general dispatch.
- [ ] Whether a company-domain email can replace the Gmail address.
- [ ] Whether photography exists. If there is no usable imagery of tankers, shore tanks or loading operations, the design should commit to diagrams and typography rather than use poor stock.
- [ ] Business hours, stated properly. The current answer in the brief is not usable copy.

### Decisions already made

Founded 1991. Fleet 49 owned plus 40 contracted. SS tankers dedicated to edible oil. Theft handled by implication - verified weights at load and discharge, not the word theft. Map traffic anonymous and never described as live. Orders and Vehicle Tracking are placeholders. Glass committed across all floating surfaces. Amber restricted to the map.
