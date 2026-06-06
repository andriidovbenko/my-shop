import { Suspense } from "react"
import { Container, Heading, HStack, Box, Flex, Text, Divider } from "@chakra-ui/react"
import { getAllProducts, getAllCategories, getProductsByCategory } from "@/lib/sanity/queries"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { CategoryFilter } from "@/components/catalog/CategoryFilter"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { LinkButton } from "@/components/ui/LinkButton"
import { buildTitle, SITE_URL } from "@/lib/metadata"
import { urlFor } from "@/lib/sanity/image"
import { routes } from "@/lib/routes"
import type { Metadata } from "next"

export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>
}): Promise<Metadata> {
  const { category, sort } = await searchParams
  const categories = await getAllCategories()
  const activeCat = category ? categories.find((c) => c.slug.current === category) : null
  const canonicalUrl = category ? `${SITE_URL}/catalog?category=${category}` : `${SITE_URL}/catalog`
  const description = activeCat
    ? `${activeCat.name} — 3D-друковані вироби в наявності. Замовляйте онлайн з доставкою по Україні.`
    : "Каталог 3D-друкованих виробів — декор, аксесуари, домашні речі. Все в наявності та готове до відправки по всій Україні."
  const title = activeCat ? `${activeCat.name} — каталог` : "Каталог"

  const ogImageSource = activeCat?.seo?.ogImage ?? activeCat?.image
  const imageUrl = ogImageSource ? urlFor(ogImageSource).width(1200).height(630).url() : undefined

  return {
    title: buildTitle(activeCat?.seo?.metaTitle || title),
    description: activeCat?.seo?.metaDescription || description,
    robots: sort ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: buildTitle(activeCat?.seo?.metaTitle || title),
      description: activeCat?.seo?.metaDescription || description,
      url: canonicalUrl,
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630, alt: activeCat?.seo?.metaTitle || title }] } : {}),
    },
    twitter: {
      title: buildTitle(activeCat?.seo?.metaTitle || title),
      description: activeCat?.seo?.metaDescription || description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>
}) {
  const { category, sort } = await searchParams
  let products = category ? await getProductsByCategory(category) : await getAllProducts()
  const categories = await getAllCategories()

  if (sort === "price_asc") {
    products = [...products].sort((a, b) => a.price - b.price)
  } else if (sort === "price_desc") {
    products = [...products].sort((a, b) => b.price - a.price)
  }

  const activeCat = category ? (categories.find((c) => c.slug.current === category) ?? null) : null
  const canonicalUrl = category ? `${SITE_URL}/catalog?category=${category}` : `${SITE_URL}/catalog`
  const pageTitle = activeCat ? activeCat.name : "Каталог"
  const description = activeCat
    ? `${activeCat.name} — 3D-друковані вироби в наявності. Замовляйте онлайн з доставкою по Україні.`
    : "Каталог 3D-друкованих виробів — декор, аксесуари, домашні речі. Все в наявності та готове до відправки по всій Україні."

  const breadcrumbs = activeCat
    ? [
        { label: "Головна", href: routes.home },
        { label: "Каталог", href: routes.catalog },
        { label: activeCat.name },
      ]
    : [
        { label: "Головна", href: routes.home },
        { label: "Каталог" },
      ]

  const basePath = category ? routes.category(category) : routes.catalog
  const sortPath = (s: string) =>
    `${basePath}${basePath.includes("?") ? "&" : "?"}sort=${s}`

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/catalog` },
      ...(activeCat
        ? [{ "@type": "ListItem", position: 3, name: activeCat.name, item: canonicalUrl }]
        : []),
    ],
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    description,
    url: canonicalUrl,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: `${SITE_URL}/product/${p.slug.current}`,
        image: p.images?.[0]?.asset
          ? urlFor(p.images[0].asset).width(800).height(800).url()
          : undefined,
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "UAH",
          availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Container maxW="7xl" py={8}>
        <Breadcrumbs items={breadcrumbs} />
        <Heading as="h1" size="xl" mb={4} color="text.default" fontFamily="heading">
          {pageTitle}
        </Heading>

        <Suspense fallback={<Box h="56px" />}>
          <CategoryFilter categories={categories} />
        </Suspense>

        <Flex alignItems="center" justifyContent="space-between" mb={6} flexWrap="wrap" gap={3}>
          <HStack gap={2} flexWrap="wrap">
            <Text fontSize="sm" color="text.muted" fontWeight="medium">
              Сортування:
            </Text>
            <LinkButton
              href={basePath}
              size="sm"
              variant={!sort ? "solid" : "outline"}
              colorScheme={!sort ? undefined : undefined}
              bg={!sort ? "accent.default" : "transparent"}
              color={!sort ? "white" : "accent.default"}
              borderWidth="1px"
              borderColor="accent.default"
              _hover={{ bg: "accent.default", color: "white" }}
            >
              За замовчуванням
            </LinkButton>
            <LinkButton
              href={sortPath("price_asc")}
              size="sm"
              bg={sort === "price_asc" ? "accent.default" : "transparent"}
              color={sort === "price_asc" ? "white" : "accent.default"}
              borderWidth="1px"
              borderColor="accent.default"
              _hover={{ bg: "accent.default", color: "white" }}
            >
              Ціна: від низької
            </LinkButton>
            <LinkButton
              href={sortPath("price_desc")}
              size="sm"
              bg={sort === "price_desc" ? "accent.default" : "transparent"}
              color={sort === "price_desc" ? "white" : "accent.default"}
              borderWidth="1px"
              borderColor="accent.default"
              _hover={{ bg: "accent.default", color: "white" }}
            >
              Ціна: від високої
            </LinkButton>
          </HStack>
          <Text fontSize="sm" color="text.muted">
            {products.length} {products.length === 1 ? "товар" : products.length < 5 ? "товари" : "товарів"}
          </Text>
        </Flex>

        <Divider mb={6} borderColor="border.default" />

        <ProductGrid products={products} />
      </Container>
    </>
  )
}
