"use client"
import { Box, Text, Button, VStack, Badge } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import NextImage from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/sanity/image"
import type { Product } from "@/types"
import { useCart } from "@/context/CartContext"
import { routes } from "@/lib/routes"

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const toast = useToast()

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.asset,
      slug: product.slug.current,
    })
    toast({
      title: "Товар додано в кошик",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    })
  }

  const imageUrl = product.images[0]
    ? urlFor(product.images[0].asset).width(300).height(300).url()
    : null

  const inStock = product.inStock !== false

  return (
    <Box
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="card"
      overflow="hidden"
      bg="bg.card"
      shadow="card"
      _hover={{ shadow: "md", transform: "translateY(-3px)" }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
    >
      <Link href={routes.product(product.slug.current)}>
        <Box
          position="relative"
          h="200px"
          w="100%"
          bg="gray.100"
          overflow="hidden"
          sx={{
            "& img": { transition: "transform 0.35s ease" },
            "&:hover img": { transform: "scale(1.06)" },
          }}
        >
          {imageUrl ? (
            <NextImage
              src={imageUrl}
              alt={product.images[0]?.alt || product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <Box h="100%" display="flex" alignItems="center" justifyContent="center">
              <Text color="text.muted" fontSize="sm">Без фото</Text>
            </Box>
          )}
          {!inStock && (
            <Badge
              position="absolute"
              top={2}
              left={2}
              colorScheme="gray"
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="md"
            >
              Немає в наявності
            </Badge>
          )}
        </Box>
      </Link>
      <VStack p={4} align="stretch" gap={2} flex="1">
        <Link href={routes.product(product.slug.current)} style={{ textDecoration: "none" }}>
          <Text fontWeight="medium" color="text.default" _hover={{ color: "accent.default" }} noOfLines={2} minH="3em">
            {product.name}
          </Text>
        </Link>
        <Text fontWeight="bold" fontSize="lg" color="accent.default">
          {product.price} ₴
        </Text>
        <Button
          onClick={handleAddToCart}
          bg={inStock ? "accent.default" : "gray.300"}
          color="white"
          _hover={inStock ? { bg: "accent.hover" } : {}}
          size="sm"
          w="100%"
          isDisabled={!inStock}
          cursor={inStock ? "pointer" : "not-allowed"}
        >
          {inStock ? "Додати в кошик" : "Немає в наявності"}
        </Button>
      </VStack>
    </Box>
  )
}
