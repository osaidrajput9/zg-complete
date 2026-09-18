/**
 * Where the site thinks it lives.
 *
 * metadataBase was hardcoded to the production domain, which makes every
 * canonical and Open Graph URL on a preview deployment point at production.
 * NEXT_PUBLIC_SITE_URL overrides it per environment; the production domain
 * stays the default so nothing breaks when it is unset.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ziagoods.com";

/**
 * The founding year, and the only figure on the site derived from it.
 *
 * "Years on the road" was hardcoded in four places, which meant it was
 * wrong for a third of every year and silently drifted further from 1991
 * with each one. It is now computed, so 1991 is the single value anyone
 * has to keep correct.
 *
 * Evaluated when the page is built, not when it is viewed — every page
 * here is statically generated. A deployment left untouched across a new
 * year will read one low until it is rebuilt, which is the same trade any
 * static site makes and a great deal better than four copies of a number
 * nobody remembers to change.
 */
export const FOUNDED = 1991;

export const YEARS_OPERATING = new Date().getFullYear() - FOUNDED;

/**
 * Whether search engines may index this deployment.
 *
 * Off unless explicitly switched on, because the greater risk right now is
 * a half-finished site or a preview URL getting indexed under the client's
 * name. Set NEXT_PUBLIC_ALLOW_INDEXING=true on production at launch.
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/* Every indexable route. The two portal placeholders are deliberately
   absent: they carry robots.index false, because there is nothing on them
   to find. */
export const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/edible-oil-transportation", priority: 0.9 },
  { path: "/molasses-transportation", priority: 0.8 },
  { path: "/containers-finished-goods", priority: 0.7 },
  { path: "/fleet", priority: 0.8 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
] as const;
