import { Box, Heading, Container } from "@chakra-ui/react"
import { ProductGrid } from "./ProductGrid"
import type { Product } from "@/types"

interface Props {
  products: Product[]
}

export function RelatedProducts({ products }: Props) {
  if (!products.length) return null

  return (
    <Box py={12} borderTopWidth="1px" borderColor="border.default">
      <Container maxW="7xl">
        <Heading as="h2" size="lg" color="text.default" fontFamily="heading" mb={6}>
          Схожі товари
        </Heading>
        <ProductGrid products={products} />
      </Container>
    </Box>
  )
}
