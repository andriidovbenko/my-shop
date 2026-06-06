import { NextResponse } from "next/server"
import { client } from "@/lib/sanity/client"
import { urlFor } from "@/lib/sanity/image"
import { SITE_NAME, SITE_URL } from "@/lib/metadata"

function blocksToPlainText(blocks: Array<{ _type: string; children?: Array<{ text?: string }> }> | null | undefined): string {
  if (!blocks) return ""
  return blocks
    .filter((b) => b._type === "block" && b.children)
    .map((b) => b.children!.map((c) => c.text ?? "").join(""))
    .join(" ")
    .trim()
}

function escapeTsv(value: string): string {
  return value.replace(/\t/g, " ").replace(/\n/g, " ").replace(/\r/g, "")
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

  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "additional_image_link",
    "availability",
    "price",
    "condition",
    "brand",
    "mpn",
    "shipping",
    "product_type",
  ]

  const rows = products.map((p: {
    id: string
    slug: string
    name: string
    description: Array<{ _type: string; children?: Array<{ text?: string }> }>
    price: number
    inStock: boolean | null
    images: Array<{ asset: object }>
    category: string
  }) => {
    const [firstImage, ...extraImages] = p.images ?? []
    const imageLink = firstImage?.asset
      ? urlFor(firstImage.asset).width(800).height(800).url()
      : ""
    const additionalImageLinks = extraImages
      .filter((img) => img?.asset)
      .map((img) => urlFor(img.asset).width(800).height(800).url())
      .join(",")
    const description = escapeTsv(blocksToPlainText(p.description) || p.name)
    const availability = p.inStock !== false ? "in stock" : "out of stock"

    return [
      escapeTsv(p.id),
      escapeTsv(p.name),
      description,
      `${SITE_URL}/product/${p.slug}`,
      imageLink,
      additionalImageLinks,
      availability,
      `${p.price.toFixed(2)} UAH`,
      "new",
      escapeTsv(SITE_NAME),
      escapeTsv(p.id),
      "UA::90.00 UAH",
      escapeTsv(p.category ?? ""),
    ].join("\t")
  })

  const tsv = [headers.join("\t"), ...rows].join("\n")

  return new NextResponse(tsv, {
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Content-Disposition": 'attachment; filename="products.txt"',
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
