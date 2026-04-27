"use client"
import { useEffect } from "react"
import { Box, VStack, Heading, Text, Button, Divider, HStack } from "@chakra-ui/react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { routes } from "@/lib/routes"

interface Props {
  orderNumber: string
  name: string
  total: string
}

export function OrderSuccess({ orderNumber, name, total }: Props) {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const iban = process.env.NEXT_PUBLIC_IBAN
  const recipient = process.env.NEXT_PUBLIC_RECIPIENT_NAME
  const paymentPurpose = `Замовлення #${orderNumber}, ${name}`

  return (
    <VStack align="stretch" gap={6} maxW="lg" mx="auto">
      <Box textAlign="center">
        <Text fontSize="4xl" mb={2}>✓</Text>
        <Heading as="h1" size="xl" color="text.default" mb={2}>
          Замовлення прийнято!
        </Heading>
        <Text color="text.muted">
          Дякуємо за замовлення. Ми звʼяжемось з вами найближчим часом.
        </Text>
      </Box>

      <Box
        p={6}
        borderWidth="1px"
        borderColor="border.default"
        borderRadius="card"
        bg="bg.card"
        shadow="card"
      >
        <Heading as="h2" size="md" mb={4} color="text.default">
          Деталі оплати
        </Heading>
        <VStack align="stretch" gap={3} fontSize="sm">
          <HStack justify="space-between">
            <Text color="text.muted">Номер замовлення:</Text>
            <Text fontWeight="bold" color="text.default">{orderNumber}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text color="text.muted">Сума до сплати:</Text>
            <Text fontWeight="bold" color="accent.default" fontSize="lg">{total} ₴</Text>
          </HStack>
          <Divider borderColor="border.default" />
          {iban && (
            <HStack justify="space-between">
              <Text color="text.muted">IBAN:</Text>
              <Text fontWeight="medium" color="text.default" wordBreak="break-all" textAlign="right">
                {iban}
              </Text>
            </HStack>
          )}
          {recipient && (
            <HStack justify="space-between">
              <Text color="text.muted">Отримувач:</Text>
              <Text fontWeight="medium" color="text.default" textAlign="right">{recipient}</Text>
            </HStack>
          )}
          <HStack justify="space-between" align="start">
            <Text color="text.muted" flexShrink={0}>Призначення:</Text>
            <Text fontWeight="medium" color="text.default" textAlign="right">{paymentPurpose}</Text>
          </HStack>
        </VStack>
      </Box>

      <Button
        as={Link}
        href={routes.catalog}
        bg="accent.default"
        color="white"
        _hover={{ bg: "accent.hover" }}
        size="lg"
        w="full"
      >
        Продовжити покупки
      </Button>
    </VStack>
  )
}
