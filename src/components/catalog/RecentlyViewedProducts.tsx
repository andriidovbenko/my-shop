"use client"
import { useEffect, useState } from "react"
import { Box, Heading, Container } from "@chakra-ui/react"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"
import { getProductsBySlugs } from "@/lib/sanity/queries"
import { ProductGrid } from "./ProductGrid"
import type { Product } from "@/types"

interface Props {
  currentSlug?: string
}

export function RecentlyViewedProducts({ currentSlug }: Props) {
  const { slugs } = useRecentlyViewed()
  const [products, setProducts] = useState<Product[]>([])

  const displaySlugs = currentSlug ? slugs.filter(s => s !== currentSlug) : slugs

  useEffect(() => {
    if (!displaySlugs.length) return
    getProductsBySlugs(displaySlugs).then(fetched => {
      const sorted = displaySlugs
        .map(slug => fetched.find(p => p.slug.current === slug))
        .filter(Boolean) as Product[]
      setProducts(sorted.slice(0, 4))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaySlugs.join(",")])

  if (!products.length) return null

  return (
    <Box py={12} borderTopWidth="1px" borderColor="border.default">
      <Container maxW="7xl">
        <Heading as="h2" size="lg" color="text.default" fontFamily="heading" mb={6}>
          Переглянуті товари
        </Heading>
        <ProductGrid products={products} />
      </Container>
    </Box>
  )
}
