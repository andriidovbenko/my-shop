"use client"
import { Box, HStack, VStack, Text, IconButton } from "@chakra-ui/react"
import NextImage from "next/image"
import Link from "next/link"
import { urlFor } from "@/lib/sanity/image"
import { useCart } from "@/context/CartContext"
import { routes } from "@/lib/routes"
import type { CartItem as CartItemType } from "@/types"

interface Props {
  item: CartItemType
}

export function CartItem({ item }: Props) {
  const { removeItem, updateQuantity } = useCart()

  const imageUrl = item.image ? urlFor(item.image).width(120).height(120).url() : null

  return (
    <HStack
      gap={4}
      p={4}
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="card"
      bg="bg.card"
      align="center"
      shadow="card"
    >
      {/* Image */}
      <Link href={routes.product(item.slug)} style={{ flexShrink: 0 }}>
        <Box
          position="relative"
          w="80px"
          h="80px"
          borderRadius="md"
          overflow="hidden"
          bg="gray.100"
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.2s"
        >
          {imageUrl ? (
            <NextImage
              src={imageUrl}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="80px"
            />
          ) : (
            <Box h="100%" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xs" color="text.muted">Фото</Text>
            </Box>
          )}
        </Box>
      </Link>

      {/* Info */}
      <VStack align="stretch" flex="1" gap={1} minW={0}>
        <Link href={routes.product(item.slug)} style={{ textDecoration: "none" }}>
          <Text fontWeight="medium" color="text.default" noOfLines={2} _hover={{ color: "accent.default" }} transition="color 0.15s">
            {item.name}
          </Text>
        </Link>
        <Text fontSize="sm" color="text.muted">
          {item.price} ₴ × {item.quantity}
        </Text>
        <Text fontWeight="bold" color="accent.default">
          {item.price * item.quantity} ₴
        </Text>
      </VStack>

      {/* Quantity controls + delete */}
      <HStack gap={1} flexShrink={0}>
        <IconButton
          aria-label="Зменшити"
          icon={<span>−</span>}
          size="xs"
          variant="outline"
          borderColor="accent.default"
          color="accent.default"
          _hover={{ bg: "accent.default", color: "white" }}
          isDisabled={item.quantity <= 1}
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
        />
        <Text minW="1.5rem" textAlign="center" fontSize="sm" fontWeight="semibold">
          {item.quantity}
        </Text>
        <IconButton
          aria-label="Збільшити"
          icon={<span>+</span>}
          size="xs"
          variant="outline"
          borderColor="accent.default"
          color="accent.default"
          _hover={{ bg: "accent.default", color: "white" }}
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
        />
        <IconButton
          aria-label="Видалити"
          icon={<span>✕</span>}
          size="xs"
          variant="ghost"
          color="text.muted"
          _hover={{ color: "red.500", bg: "red.50" }}
          onClick={() => removeItem(item.productId)}
          ml={2}
        />
      </HStack>
    </HStack>
  )
}
