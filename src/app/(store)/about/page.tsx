import { Container, Heading, Text, VStack } from "@chakra-ui/react"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Про магазин"),
}

export default function AboutPage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "My Shop"

  return (
    <Container maxW="3xl" py={12}>
      <VStack align="stretch" gap={6}>
        <Heading as="h1" size="xl" color="text.default">
          Про магазин
        </Heading>
        <Text color="text.default" lineHeight="tall">
          {siteName} — це сучасний інтернет-магазин, де ви знайдете широкий асортимент якісних товарів за доступними цінами.
        </Text>
        <Text color="text.default" lineHeight="tall">
          Ми працюємо для того, щоб кожна покупка була зручною та приємною. Доставка здійснюється по всій Україні через Нову Пошту.
        </Text>
        <Text color="text.default" lineHeight="tall">
          Якщо у вас виникли запитання — звʼяжіться з нами через контакти в нижній частині сторінки.
        </Text>
      </VStack>
    </Container>
  )
}
