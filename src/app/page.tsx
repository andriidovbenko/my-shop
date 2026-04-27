import { Box, Container, Heading, Text, SimpleGrid, Flex } from "@chakra-ui/react"
import NextImage from "next/image"
import Link from "next/link"
import { getAllProducts, getAllCategories } from "@/lib/sanity/queries"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { LinkButton } from "@/components/ui/LinkButton"
import { urlFor } from "@/lib/sanity/image"
import { buildTitle } from "@/lib/metadata"
import { routes } from "@/lib/routes"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Головна"),
}

export const revalidate = 3600

export default async function HomePage() {
  const products = await getAllProducts()
  const categories = await getAllCategories()
  const latestProducts = products.slice(0, 8)

  return (
    <Box>
      {/* Hero */}
      <Box
        bgGradient="linear(to-br, brand.700, brand.500, brand.400)"
        color="white"
        py={{ base: 16, md: 24 }}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-100px"
          left="-100px"
          w="360px"
          h="360px"
          borderRadius="full"
          bg="whiteAlpha.100"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-80px"
          right="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="whiteAlpha.100"
          pointerEvents="none"
        />
        <Container maxW="4xl" position="relative">
          <Heading as="h1" size="2xl" mb={4} letterSpacing="tight" fontFamily="heading">
            {process.env.NEXT_PUBLIC_SITE_NAME || "My Shop"}
          </Heading>
          <Text fontSize="xl" mb={10} opacity={0.9} maxW="lg" mx="auto" lineHeight="tall">
            {process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Купуйте найкращі товари"}
          </Text>
          <LinkButton
            href={routes.catalog}
            size="lg"
            bg="white"
            color="brand.700"
            _hover={{ bg: "gray.50", transform: "translateY(-2px)", shadow: "xl" }}
            shadow="lg"
            fontWeight="bold"
            px={10}
            transition="all 0.2s"
          >
            Перейти до каталогу
          </LinkButton>
        </Container>
      </Box>

      <Container maxW="7xl" py={14}>
        {/* Categories */}
        {categories.length > 0 && (
          <Box mb={16}>
            <Flex alignItems="center" justifyContent="space-between" mb={6}>
              <Heading as="h2" size="lg" color="text.default" fontFamily="heading">
                Категорії
              </Heading>
              <Link
                href={routes.catalog}
                style={{
                  color: "var(--chakra-colors-accent-default)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Всі категорії →
              </Link>
            </Flex>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={4}>
              {categories.map((cat) => (
                <Link key={cat._id} href={routes.category(cat.slug.current)} style={{ textDecoration: "none" }}>
                  <Box
                    borderRadius="card"
                    overflow="hidden"
                    bg="bg.card"
                    shadow="card"
                    p={4}
                    textAlign="center"
                    _hover={{ shadow: "md", transform: "translateY(-3px)" }}
                    transition="all 0.2s"
                    cursor="pointer"
                    h="100%"
                  >
                    {cat.image && (
                      <Box
                        position="relative"
                        mb={3}
                        borderRadius="md"
                        overflow="hidden"
                        sx={{ aspectRatio: "1 / 1" }}
                      >
                        <NextImage
                          src={urlFor(cat.image).width(300).height(300).url()}
                          alt={cat.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </Box>
                    )}
                    <Text fontWeight="medium" color="text.default">
                      {cat.name}
                    </Text>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Latest products */}
        <Flex alignItems="center" justifyContent="space-between" mb={6}>
          <Heading as="h2" size="lg" color="text.default" fontFamily="heading">
            Нові надходження
          </Heading>
          <Link
            href={routes.catalog}
            style={{
              color: "var(--chakra-colors-accent-default)",
              fontSize: "0.9rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Дивитись всі →
          </Link>
        </Flex>
        <ProductGrid products={latestProducts} />
      </Container>
    </Box>
  )
}
