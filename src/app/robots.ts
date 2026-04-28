import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/catalog", "/product/", "/about", "/privacy", "/offer"],
      disallow: ["/studio", "/api", "/cart", "/checkout"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
