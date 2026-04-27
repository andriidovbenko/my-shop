import { Container, Heading, Text, VStack } from "@chakra-ui/react"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Публічна оферта"),
}

export default function OfferPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "My Shop"

  return (
    <Container maxW="3xl" py={12}>
      <VStack align="stretch" gap={6}>
        <Heading as="h1" size="xl" color="text.default">
          Публічна оферта
        </Heading>

        <Text color="text.muted" fontSize="sm">Остання редакція: {new Date().getFullYear()}</Text>

        <VStack align="stretch" gap={4}>
          <Heading as="h2" size="md" color="text.default">1. Загальні положення</Heading>
          <Text color="text.default" lineHeight="tall">
            Цей документ є публічною офертою {siteName} (далі — «Продавець») та визначає умови продажу товарів через інтернет-магазин. Оформлення замовлення означає повне та беззастережне прийняття умов цієї оферти.
          </Text>

          <Heading as="h2" size="md" color="text.default">2. Предмет договору</Heading>
          <Text color="text.default" lineHeight="tall">
            Продавець зобовʼязується передати у власність Покупця товар, а Покупець зобовʼязується прийняти та оплатити його відповідно до умов цього договору.
          </Text>

          <Heading as="h2" size="md" color="text.default">3. Ціни та оплата</Heading>
          <Text color="text.default" lineHeight="tall">
            Ціни вказані в гривнях (₴) та включають усі необхідні податки. Оплата здійснюється банківським переказом на IBAN, вказаний у підтвердженні замовлення. Замовлення вважається оплаченим після надходження коштів на рахунок Продавця.
          </Text>

          <Heading as="h2" size="md" color="text.default">4. Доставка</Heading>
          <Text color="text.default" lineHeight="tall">
            Доставка здійснюється службою «Нова Пошта» на відділення або поштомат, обраний Покупцем. Строки доставки залежать від роботи служби доставки та регіону.
          </Text>

          <Heading as="h2" size="md" color="text.default">5. Повернення та обмін</Heading>
          <Text color="text.default" lineHeight="tall">
            Повернення товару здійснюється відповідно до чинного законодавства України. Для ініціювання повернення звернiться до нас протягом 14 днів з моменту отримання товару.
          </Text>

          <Heading as="h2" size="md" color="text.default">6. Відповідальність сторін</Heading>
          <Text color="text.default" lineHeight="tall">
            Продавець несе відповідальність за якість товару відповідно до чинного законодавства України. Продавець не несе відповідальності за затримки доставки з вини служби доставки.
          </Text>
        </VStack>
      </VStack>
    </Container>
  )
}
