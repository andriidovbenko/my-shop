import { NextResponse } from "next/server"
import { client } from "@/lib/sanity/client"
import { urlFor } from "@/lib/sanity/image"
import { SITE_NAME, SITE_URL } from "@/lib/metadata"

const BRAND = SITE_NAME

function blocksToPlainText(blocks: Array<{ _type: string; children?: Array<{ text?: string }> }> | null | undefined): string {
  if (!blocks) return ""
  return blocks
    .filter((b) => b._type === "block" && b.children)
    .map((b) => b.children!.map((c) => c.text ?? "").join(""))
    .join(" ")
    .trim()
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const products = await client.fetch(`
    *[_type == "product"] | order(_createdAt desc) {
      "id": coalesce(sku, slug.current),
      "slug": slug.current,
      name,
      description,
      price,
      inStock,
      images,
      "category": category->name,
    }
  `)

  const items = products.map((p: {
    id: string
    slug: string
    name: string
    description: Array<{ _type: string; children?: Array<{ text?: string }> }>
    price: number
    inStock: boolean
    images: Array<{ asset: object }>
    category: string
  }) => {
    const imageUrl = p.images?.[0]?.asset
      ? urlFor(p.images[0].asset).width(800).height(800).url()
      : ""
    const description = escapeXml(blocksToPlainText(p.description) || p.name)
    const availability = p.inStock ? "in_stock" : "out_of_stock"
    const price = `${p.price.toFixed(2)} UAH`
    const link = `${SITE_URL}/product/${p.slug}`

    return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${description}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      ${imageUrl ? `<g:image_link>${escapeXml(imageUrl)}</g:image_link>` : ""}
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:brand>${escapeXml(BRAND)}</g:brand>
      <g:mpn>${escapeXml(p.id)}</g:mpn>
      <g:condition>new</g:condition>
      ${p.category ? `<g:product_type>${escapeXml(p.category)}</g:product_type>` : ""}
    </item>`
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_NAME)} — унікальні вироби з 3D-друку</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
