import { Box, SimpleGrid, Text } from "@chakra-ui/react"
import type { Product } from "@/types"
import { ProductCard } from "./ProductCard"
import { LinkButton } from "@/components/ui/LinkButton"
import { routes } from "@/lib/routes"

interface Props {
  products: Product[]
}

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <Box textAlign="center" py={16}>
        <Text color="text.muted" mb={4}>Товарів не знайдено</Text>
        <LinkButton href={routes.catalog} variant="outline" borderColor="accent.default" color="accent.default">
          Переглянути весь каталог
        </LinkButton>
      </Box>
    )
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </SimpleGrid>
  )
}
