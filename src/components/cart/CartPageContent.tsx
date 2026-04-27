"use client"
import { Box, VStack, Text, Button } from "@chakra-ui/react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { routes } from "@/lib/routes"
import { CartItem } from "./CartItem"
import { CartSummary } from "./CartSummary"

function EmptyCartIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#cbd5e0" }}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

export function CartPageContent() {
  const { items } = useCart()

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={16}>
        <Box display="flex" justifyContent="center" mb={4}>
          <EmptyCartIcon />
        </Box>
        <Text fontSize="xl" fontWeight="medium" color="text.default" mb={2}>
          Ваш кошик порожній
        </Text>
        <Text fontSize="md" color="text.muted" mb={8}>
          Додайте товари, щоб продовжити покупки
        </Text>
        <Button
          as={Link}
          href={routes.catalog}
          bg="accent.default"
          color="white"
          _hover={{ bg: "accent.hover" }}
          size="lg"
        >
          Перейти до каталогу
        </Button>
      </Box>
    )
  }

  return (
    <Box display={{ base: "block", lg: "flex" }} gap={8} alignItems="start">
      <VStack flex="1" align="stretch" gap={3}>
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </VStack>
      <Box w={{ base: "full", lg: "320px" }} mt={{ base: 6, lg: 0 }} flexShrink={0}>
        <CartSummary />
      </Box>
    </Box>
  )
}
