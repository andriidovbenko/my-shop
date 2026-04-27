import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/metadata"
import { getSitemapProducts, getSitemapCategories } from "@/lib/sanity/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getSitemapProducts(),
    getSitemapCategories(),
  ])

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/catalog?category=${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/catalog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productEntries,
    ...categoryEntries,
  ]
}
