"use client"
import { Box, VStack, HStack, Text, Button, Divider } from "@chakra-ui/react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { routes } from "@/lib/routes"

export function CartSummary() {
  const { totalPrice, totalItems } = useCart()

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="card"
      bg="bg.card"
      shadow="card"
    >
      <VStack align="stretch" gap={4}>
        <Text fontWeight="bold" fontSize="lg" color="text.default">
          Ваше замовлення
        </Text>
        <Divider borderColor="border.default" />
        <HStack justify="space-between">
          <Text color="text.muted">Товарів:</Text>
          <Text color="text.default">{totalItems} шт.</Text>
        </HStack>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg" color="text.default">
            Разом:
          </Text>
          <Text fontWeight="bold" fontSize="xl" color="accent.default">
            {totalPrice} ₴
          </Text>
        </HStack>
        <Button
          as={Link}
          href={routes.checkout}
          bg="accent.default"
          color="white"
          _hover={{ bg: "accent.hover" }}
          size="lg"
          w="full"
        >
          Оформити замовлення
        </Button>
        <Link href={routes.catalog} style={{ textAlign: "center", display: "block", color: "var(--chakra-colors-text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>
          ← Продовжити покупки
        </Link>
      </VStack>
    </Box>
  )
}
