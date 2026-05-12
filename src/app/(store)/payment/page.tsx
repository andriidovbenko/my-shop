import { Box, Container, Heading, Text, VStack, SimpleGrid } from "@chakra-ui/react"
import { buildTitle, SITE_URL } from "@/lib/metadata"
import { PAYMENT } from "@/lib/payment"
import { PaymentFields } from "@/components/payment/PaymentFields"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Оплата"),
  description: "Реквізити для оплати замовлень у магазині 3Dиво. Банківський переказ на IBAN.",
  alternates: {
    canonical: `${SITE_URL}/payment`,
  },
}

const fields = [
  { label: "Отримувач", value: PAYMENT.recipient },
  { label: "IBAN", value: PAYMENT.iban },
  { label: "ІПН/ЄДРПОУ", value: PAYMENT.ipn },
  { label: "Банк", value: PAYMENT.bank },
  { label: "МФО", value: PAYMENT.mfo },
  { label: "ЄДРПОУ Банку", value: PAYMENT.bankEdrpou },
]

export default function PaymentPage() {
  return (
    <Box>
      <Box bg="dark.900" color="white" py={{ base: 12, md: 16 }} position="relative" overflow="hidden">
        <Box
          position="absolute" inset={0}
          bgGradient="linear(135deg, #1A8FE318 0%, transparent 60%, #F5821F18 100%)"
          pointerEvents="none"
        />
        <Container maxW="3xl" textAlign="center" position="relative">
          <Text fontSize="sm" fontWeight="600" color="#F5821F" letterSpacing="widest" textTransform="uppercase" mb={3}>
            Оплата
          </Text>
          <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="800" mb={4}>
            Реквізити для оплати
          </Heading>
          <Text color="whiteAlpha.700" fontSize="lg" lineHeight="tall" maxW="460px" mx="auto">
            Банківський переказ на IBAN після оформлення замовлення
          </Text>
        </Container>
      </Box>

      <Container maxW="2xl" py={14}>
        <SimpleGrid columns={1} gap={5}>
          <Box
            bg="bg.card"
            borderRadius="card"
            shadow="card"
            border="1px solid"
            borderColor="border.default"
            p={6}
          >
            <Heading as="h2" size="md" mb={5} color="text.default">
              💳 Банківські реквізити
            </Heading>
            <PaymentFields fields={fields} />
          </Box>

          <Box
            bg="bg.card"
            borderRadius="card"
            shadow="card"
            border="1px solid"
            borderColor="border.default"
            p={6}
          >
            <Heading as="h2" size="md" mb={4} color="text.default">
              Як оплатити
            </Heading>
            <VStack align="stretch" gap={3} fontSize="sm" color="text.muted" lineHeight="tall">
              <Text>1. Оформіть замовлення на сайті — ми підтвердимо його та зв&apos;яжемося з вами.</Text>
              <Text>2. Виконайте переказ на вказаний IBAN на суму замовлення.</Text>
              <Text>3. У призначенні платежу вкажіть номер замовлення.</Text>
              <Text>4. Після надходження оплати ми відправимо замовлення протягом 1–2 робочих днів.</Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
