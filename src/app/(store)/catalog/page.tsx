import { Suspense } from "react"
import { Container, Heading, HStack, Box, Flex, Text, Divider } from "@chakra-ui/react"
import { getAllProducts, getAllCategories, getProductsByCategory } from "@/lib/sanity/queries"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { CategoryFilter } from "@/components/catalog/CategoryFilter"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { LinkButton } from "@/components/ui/LinkButton"
import { buildTitle, SITE_URL } from "@/lib/metadata"
import { routes } from "@/lib/routes"
import type { Metadata } from "next"

export const revalidate = 3600

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}): Promise<Metadata> {
  const { category } = await searchParams
  const categories = await getAllCategories()
  const activeCat = category ? categories.find((c) => c.slug.current === category) : null
  const description = activeCat?.name ?? process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Каталог товарів"
  return {
    title: buildTitle("Каталог"),
    description,
    openGraph: {
      title: buildTitle("Каталог"),
      description,
      url: category ? `${SITE_URL}/catalog?category=${category}` : `${SITE_URL}/catalog`,
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

  const breadcrumbs = [
    { label: "Головна", href: routes.home },
    { label: "Каталог" },
  ]

  const basePath = category ? routes.category(category) : routes.catalog
  const sortPath = (s: string) =>
    `${basePath}${basePath.includes("?") ? "&" : "?"}sort=${s}`

  return (
    <Container maxW="7xl" py={8}>
      <Breadcrumbs items={breadcrumbs} />
      <Heading as="h1" size="xl" mb={4} color="text.default" fontFamily="heading">
        Каталог
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
  )
}
