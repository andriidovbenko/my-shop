import { notFound } from "next/navigation"
import { Container, Box, VStack, Heading, Text, Table, Tbody, Tr, Td, Badge, Divider } from "@chakra-ui/react"
import { getProductBySlug, getAllProductSlugs } from "@/lib/sanity/queries"
import { urlFor } from "@/lib/sanity/image"
import { buildTitle, truncate, SITE_URL } from "@/lib/metadata"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductActions } from "@/components/product/ProductActions"
import { PortableTextRenderer } from "@/components/ui/PortableTextRenderer"
import { routes } from "@/lib/routes"
import type { Metadata } from "next"
import type { PortableTextBlock } from "@portabletext/react"

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: buildTitle("Товар не знайдено") }

  const title = product.seo?.metaTitle || product.name
  const description = product.seo?.metaDescription || truncate(portableTextToPlain(product.description), 160)
  const imageUrl = product.seo?.ogImage
    ? urlFor(product.seo.ogImage).width(1200).height(630).url()
    : product.images[0]
    ? urlFor(product.images[0].asset).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "uk_UA",
      title,
      description,
      url: `${SITE_URL}/product/${slug}`,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    alternates: {
      canonical: `${SITE_URL}/product/${slug}`,
    },
  }
}

type PortableTextSpan = { text?: string }

function portableTextToPlain(blocks: PortableTextBlock[]): string {
  if (!Array.isArray(blocks)) return ""
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children as PortableTextSpan[] | undefined)?.map((c) => c.text).join("") ?? "")
    .join(" ")
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const seoDescription = product.seo?.metaDescription || truncate(portableTextToPlain(product.description), 160)

  const imageUrls = product.images.map((img) =>
    urlFor(img.asset).width(800).height(800).url()
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: seoDescription,
    image: imageUrls,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "UAH",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${slug}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
        ...(product.category
          ? [
              {
                "@type": "ListItem",
                position: 3,
                name: product.category.name,
                item: `${SITE_URL}/catalog?category=${product.category.slug.current}`,
              },
              { "@type": "ListItem", position: 4, name: product.name },
            ]
          : [{ "@type": "ListItem", position: 3, name: product.name }]),
      ],
    },
  }

  const breadcrumbs = [
    { label: "Головна", href: routes.home },
    { label: "Каталог", href: routes.catalog },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: routes.category(product.category.slug.current),
          },
        ]
      : []),
    { label: product.name },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container maxW="7xl" py={8}>
        <Breadcrumbs items={breadcrumbs} />
        <Box display={{ base: "block", md: "flex" }} gap={10}>
          <Box flex="1" mb={{ base: 8, md: 0 }}>
            <ProductGallery images={product.images} productName={product.name} />
          </Box>
          <VStack flex="1" align="stretch" gap={4}>
            <Heading as="h1" size="xl" color="text.default">
              {product.name}
            </Heading>

            <Box>
              <Text fontSize="3xl" fontWeight="bold" color="accent.default" mb={2}>
                {product.price} ₴
              </Text>
              <Badge
                colorScheme={product.inStock !== false ? "green" : "gray"}
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {product.inStock !== false ? "В наявності" : "Немає в наявності"}
              </Badge>
            </Box>

            {product.attributes && product.attributes.length > 0 && (
              <Table size="sm" variant="simple">
                <Tbody>
                  {product.attributes.map((attr: { key: string; value: string }, i: number) => (
                    <Tr key={i}>
                      <Td fontWeight="medium" color="text.muted" w="40%">
                        {attr.key}
                      </Td>
                      <Td color="text.default">{attr.value}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}

            {product.description && (
              <PortableTextRenderer value={product.description} />
            )}

            <Divider borderColor="border.default" />

            <ProductActions product={product} />
          </VStack>
        </Box>
      </Container>
    </>
  )
}
