import type { MetadataRoute } from "next";

import { ALLOW_INDEXING, SITE_URL } from "@/lib/site";

/* Blocked until someone sets NEXT_PUBLIC_ALLOW_INDEXING on the production
   deployment. An unfinished site indexed under the client's name is harder
   to undo than it is to avoid. */
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
