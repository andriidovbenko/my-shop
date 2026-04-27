import { Container, Heading, Text, VStack } from "@chakra-ui/react"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Політика конфіденційності"),
}

export default function PrivacyPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "My Shop"

  return (
    <Container maxW="3xl" py={12}>
      <VStack align="stretch" gap={6}>
        <Heading as="h1" size="xl" color="text.default">
          Політика конфіденційності
        </Heading>

        <Text color="text.muted" fontSize="sm">Остання редакція: {new Date().getFullYear()}</Text>

        <VStack align="stretch" gap={4}>
          <Heading as="h2" size="md" color="text.default">1. Збір інформації</Heading>
          <Text color="text.default" lineHeight="tall">
            {siteName} збирає персональні дані (імʼя, email, номер телефону, адреса доставки), які ви надаєте під час оформлення замовлення. Ці дані використовуються виключно для обробки та доставки замовлень.
          </Text>

          <Heading as="h2" size="md" color="text.default">2. Використання інформації</Heading>
          <Text color="text.default" lineHeight="tall">
            Ваші персональні дані використовуються для: обробки замовлень, звʼязку щодо статусу замовлення, покращення якості обслуговування. Ми не передаємо ваші дані третім особам, крім служб доставки.
          </Text>

          <Heading as="h2" size="md" color="text.default">3. Захист інформації</Heading>
          <Text color="text.default" lineHeight="tall">
            Ми вживаємо всіх необхідних заходів для захисту ваших персональних даних від несанкціонованого доступу, зміни або розголошення.
          </Text>

          <Heading as="h2" size="md" color="text.default">4. Файли cookie</Heading>
          <Text color="text.default" lineHeight="tall">
            Сайт використовує файли cookie для коректної роботи кошика та покращення досвіду користування. Ви можете вимкнути cookie у налаштуваннях браузера.
          </Text>

          <Heading as="h2" size="md" color="text.default">5. Контакти</Heading>
          <Text color="text.default" lineHeight="tall">
            З питань захисту персональних даних звертайтесь за контактами, вказаними у розділі «Про нас».
          </Text>
        </VStack>
      </VStack>
    </Container>
  )
}
