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
