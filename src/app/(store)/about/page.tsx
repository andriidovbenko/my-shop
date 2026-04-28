import { Box, Container, Heading, Text, VStack, SimpleGrid, Flex, Divider } from "@chakra-ui/react"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Про нас"),
}

const values = [
  {
    icon: "🏆",
    title: "Якість насамперед",
    desc: "Друкуємо на сучасному обладнанні, використовуємо перевірені філаменти. Кожен виріб проходить контроль перед відправкою.",
  },
  {
    icon: "⚡",
    title: "Швидка відправка",
    desc: "Всі товари в наявності — відправляємо Новою Поштою або Укрпоштою протягом 1–2 робочих днів.",
  },
  {
    icon: "🤝",
    title: "Підтримка покупців",
    desc: "Є питання — пишіть у чат на сайті або в Telegram. Відповімо швидко та по суті.",
  },
  {
    icon: "🇺🇦",
    title: "Зроблено в Україні",
    desc: "Виробляємо в Україні, підтримуємо українське. Кожна покупка — підтримка місцевого виробника.",
  },
]

export default function AboutPage() {
  const iban = process.env.NEXT_PUBLIC_IBAN
  const recipient = process.env.NEXT_PUBLIC_RECIPIENT_NAME
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const telegram = process.env.NEXT_PUBLIC_CONTACT_TELEGRAM
  const hasContacts = phone || email || telegram

  return (
    <Box>
      {/* Page hero */}
      <Box bg="dark.900" color="white" py={{ base: 12, md: 16 }} position="relative" overflow="hidden">
        <Box
          position="absolute" inset={0}
          bgGradient="linear(135deg, #1A8FE318 0%, transparent 60%, #F5821F18 100%)"
          pointerEvents="none"
        />
        <Container maxW="3xl" textAlign="center" position="relative">
          <Text fontSize="sm" fontWeight="600" color="#F5821F" letterSpacing="widest" textTransform="uppercase" mb={3}>
            Про нас
          </Text>
          <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="800" mb={4}>
            3Dиво — магазин{" "}
            <Box as="span" color="#1A8FE3">3D-виробів</Box>
          </Heading>
          <Text color="whiteAlpha.700" fontSize="lg" lineHeight="tall" maxW="500px" mx="auto">
            Друкуємо диво в кожній деталі — готові вироби з 3D-друку, що поєднують функціональність та естетику
          </Text>
        </Container>
      </Box>

      <Container maxW="3xl" py={14}>
        {/* Story */}
        <VStack align="stretch" gap={5} mb={16}>
          <Heading as="h2" size="lg" color="text.default">
            Наша історія
          </Heading>
          <Text color="text.default" lineHeight="tall" fontSize="md">
            3Dиво — це магазин унікальних виробів, надрукованих на 3D-принтері. Ми захоплені технологією 3D-друку і хочемо зробити її результати доступними для кожного.
          </Text>
          <Text color="text.muted" lineHeight="tall" fontSize="md">
            У нашому каталозі — готові вироби, які можна замовити просто зараз: декор, корисні дрібниці для дому, аксесуари та багато іншого. Все в наявності та готове до відправки.
          </Text>
        </VStack>

        {/* Values */}
        <Box mb={16}>
          <Heading as="h2" size="lg" color="text.default" mb={8}>
            Чому обирають нас
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
            {values.map((v) => (
              <Flex
                key={v.title}
                gap={4}
                align="flex-start"
                bg="bg.card"
                p={5}
                borderRadius="card"
                shadow="card"
                border="1px solid"
                borderColor="border.default"
              >
                <Text fontSize="2xl" flexShrink={0}>{v.icon}</Text>
                <Box>
                  <Text fontWeight="700" fontSize="sm" color="text.default" mb={1}>{v.title}</Text>
                  <Text fontSize="sm" color="text.muted" lineHeight="tall">{v.desc}</Text>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </Box>

        {/* Payment & Delivery */}
        {(iban || recipient) && (
          <Box mb={16}>
            <Heading as="h2" size="lg" color="text.default" mb={6}>
              Оплата та доставка
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
              <Box bg="bg.card" borderRadius="card" shadow="card" border="1px solid" borderColor="border.default" p={5} display="flex" flexDirection="column">
                <Flex align="center" gap={2} mb={4}>
                  <Text fontSize="xl">💳</Text>
                  <Text fontWeight="700" fontSize="sm" color="text.default">Оплата</Text>
                </Flex>
                <Text fontSize="sm" color="text.muted" lineHeight="tall" mb={4} flex="1">
                  Банківський переказ на IBAN після оформлення замовлення
                </Text>
                <Divider borderColor="border.default" mb={4} />
                <VStack align="stretch" gap={2} fontSize="sm">
                  {recipient && (
                    <Box>
                      <Text color="text.muted" fontSize="xs" mb={0.5}>Отримувач</Text>
                      <Text color="text.default" fontWeight="500">{recipient}</Text>
                    </Box>
                  )}
                  {iban && (
                    <Box>
                      <Text color="text.muted" fontSize="xs" mb={0.5}>IBAN</Text>
                      <Text color="text.default" fontWeight="500" wordBreak="break-all">{iban}</Text>
                    </Box>
                  )}
                </VStack>
              </Box>

              <Box bg="bg.card" borderRadius="card" shadow="card" border="1px solid" borderColor="border.default" p={5} display="flex" flexDirection="column">
                <Flex align="center" gap={2} mb={4}>
                  <Text fontSize="xl">📦</Text>
                  <Text fontWeight="700" fontSize="sm" color="text.default">Доставка</Text>
                </Flex>
                <Text fontSize="sm" color="text.muted" lineHeight="tall" mb={4} flex="1">
                  Нова Пошта або Укрпошта — доставка по всій Україні на ваш вибір
                </Text>
                <Divider borderColor="border.default" mb={4} />
                <VStack align="stretch" gap={2} fontSize="sm">
                  <Box>
                    <Text color="text.muted" fontSize="xs" mb={0.5}>Терміни відправки</Text>
                    <Text color="text.default" fontWeight="500">1–2 робочих дні після оплати</Text>
                  </Box>
                  <Box>
                    <Text color="text.muted" fontSize="xs" mb={0.5}>Вартість доставки</Text>
                    <Text color="text.default" fontWeight="500">За тарифами перевізника</Text>
                  </Box>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>
        )}

        {/* Contact */}
        <Box
          bg="dark.900"
          color="white"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute" inset={0}
            bgGradient="linear(135deg, #1A8FE318 0%, transparent 60%, #F5821F18 100%)"
            pointerEvents="none"
            borderRadius="2xl"
          />
          <Box position="relative">
            <Heading as="h2" size="md" mb={2} fontWeight="700">
              Є запитання?
            </Heading>
            <Text color="whiteAlpha.700" fontSize="sm" mb={5}>
              Напишіть нам — відповімо швидко
            </Text>
            <VStack align="flex-start" gap={3}>
              {hasContacts ? (
                <>
                  {phone && (
                    <Flex align="center" gap={2}>
                      <Text fontSize="lg">📞</Text>
                      <Text as="a" href={"tel:" + phone} color="white" fontSize="sm" fontWeight="500">
                        {phone}
                      </Text>
                    </Flex>
                  )}
                  {email && (
                    <Flex align="center" gap={2}>
                      <Text fontSize="lg">✉️</Text>
                      <Text as="a" href={"mailto:" + email} color="white" fontSize="sm" fontWeight="500">
                        {email}
                      </Text>
                    </Flex>
                  )}
                  {telegram && (
                    <Flex align="center" gap={2}>
                      <Text fontSize="lg">💬</Text>
                      <Text
                        as="a"
                        href={"https://t.me/" + telegram.replace("@", "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="#1A8FE3"
                        fontSize="sm"
                        fontWeight="500"
                      >
                        {telegram}
                      </Text>
                    </Flex>
                  )}
                </>
              ) : (
                <Flex align="center" gap={2}>
                  <Text fontSize="lg">💬</Text>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    Скористайтесь чатом у правому нижньому куті сторінки
                  </Text>
                </Flex>
              )}
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
