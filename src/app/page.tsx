import { Box, Container, Heading, Text, SimpleGrid, Flex } from "@chakra-ui/react"
import NextImage from "next/image"
import Link from "next/link"
import { getAllProducts, getAllCategories } from "@/lib/sanity/queries"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { LinkButton } from "@/components/ui/LinkButton"
import { urlFor } from "@/lib/sanity/image"
import { SITE_URL } from "@/lib/metadata"
import { Printer3DIcon } from "@/components/icons/Printer3DIcon"
import { routes } from "@/lib/routes"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "3Dиво — магазин 3D-виробів в Україні" },
  description: "Унікальні вироби з 3D-друку в наявності — декор, аксесуари, корисні речі. Замовляйте онлайн з доставкою Новою Поштою по всій Україні.",
  openGraph: {
    title: "3Dиво — магазин 3D-виробів в Україні",
    description: "Унікальні вироби з 3D-друку в наявності. Замовляйте онлайн з доставкою по всій Україні.",
    url: SITE_URL,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export const revalidate = 3600

const features = [
  {
    icon: "🛒",
    title: "Є в наявності",
    desc: "Всі товари — готові до відправки, без очікування виготовлення",
  },
  {
    icon: "⚡",
    title: "Швидка відправка",
    desc: "Відправляємо Новою Поштою або Укрпоштою протягом 1–2 робочих днів після оплати",
  },
  {
    icon: "✅",
    title: "Контроль якості",
    desc: "Кожен виріб перевіряємо перед відправкою — ніяких сюрпризів",
  },
  {
    icon: "📦",
    title: "Надійне пакування",
    desc: "Пакуємо з запасом міцності — товар приїде цілим навіть здалеку",
  },
]

export default async function HomePage() {
  const products = await getAllProducts()
  const categories = await getAllCategories()
  const latestProducts = products.slice(0, 8)

  return (
    <Box>
      {/* Hero */}
      <Box
        bg="dark.900"
        color="white"
        py={{ base: 14, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        {/* Background decorative blobs */}
        <Box
          position="absolute"
          top="-120px"
          left="-120px"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="#1A8FE3"
          opacity={0.08}
          pointerEvents="none"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="-100px"
          right="-100px"
          w="350px"
          h="350px"
          borderRadius="full"
          bg="#F5821F"
          opacity={0.1}
          pointerEvents="none"
          filter="blur(60px)"
        />

        <Container maxW="5xl" position="relative">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={{ base: 8, md: 12 }}
          >
            {/* 3D Printer illustration */}
            <Box
              flexShrink={0}
              mx={{ base: "auto", md: 0 }}
              w={{ base: "200px", md: "240px" }}
              h={{ base: "200px", md: "240px" }}
              boxShadow="0 0 80px rgba(26,143,227,0.25)"
            >
              <Printer3DIcon />
            </Box>

            {/* Text */}
            <Box textAlign={{ base: "center", md: "left" }}>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="600"
                color="#F5821F"
                letterSpacing="widest"
                textTransform="uppercase"
                mb={3}
              >
                Магазин 3D-виробів
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="800"
                lineHeight="1.1"
                mb={4}
                letterSpacing="tight"
              >
                Друкуємо диво{" "}
                <Box as="span" color="#1A8FE3">
                  в кожній
                </Box>{" "}
                <Box as="span" color="#F5821F">
                  деталі
                </Box>
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="whiteAlpha.700"
                mb={8}
                maxW="480px"
                mx={{ base: "auto", md: 0 }}
                lineHeight="tall"
              >
                Унікальні вироби з 3D-друку — в наявності та готові до відправки. Якість, що відчувається в кожному шарі.
              </Text>
              <Flex
                gap={4}
                justify={{ base: "center", md: "flex-start" }}
                wrap="wrap"
              >
                <LinkButton
                  href={routes.catalog}
                  size="lg"
                  bg="#1A8FE3"
                  color="white"
                  _hover={{ bg: "#1478c5", transform: "translateY(-2px)", shadow: "xl" }}
                  shadow="lg"
                  fontWeight="bold"
                  px={8}
                  transition="all 0.2s"
                >
                  Переглянути каталог
                </LinkButton>
                <LinkButton
                  href={routes.about}
                  size="lg"
                  variant="outline"
                  borderColor="whiteAlpha.400"
                  color="white"
                  _hover={{ bg: "whiteAlpha.100", borderColor: "white" }}
                  px={8}
                  transition="all 0.2s"
                >
                  Про нас
                </LinkButton>
              </Flex>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features strip */}
      <Box bg="gray.50" py={12} borderBottomWidth="1px" borderColor="gray.100">
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
            {features.map((f) => (
              <Flex
                key={f.title}
                align="flex-start"
                gap={4}
                bg="white"
                p={5}
                borderRadius="card"
                shadow="card"
              >
                <Text fontSize="2xl" flexShrink={0}>{f.icon}</Text>
                <Box>
                  <Text fontWeight="700" fontSize="sm" color="gray.900" mb={1}>{f.title}</Text>
                  <Text fontSize="xs" color="gray.500" lineHeight="tall">{f.desc}</Text>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ДрукАрмія banner */}
      <Box bg="#0D2137" py={3} borderBottomWidth="1px" borderColor="whiteAlpha.100">
        <Container maxW="7xl">
          <Flex justify="center" align="center" gap={2} wrap="wrap">
            <Text fontSize="sm" color="whiteAlpha.900" textAlign="center">
              🇺🇦 Безкоштовно друкуємо для ЗСУ у складі волонтерської ініціативи{" "}
              <Box
                as="a"
                href="https://drukar.me/hyz51d57"
                target="_blank"
                rel="noopener noreferrer"
                color="#1A8FE3"
                fontWeight="700"
                _hover={{ textDecoration: "underline" }}
              >
                ДрукАрмія
              </Box>
              {" "}— понад 100 кг надруковано для захисників
            </Text>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={14}>
        {/* Categories */}
        {categories.length > 0 && (
          <Box mb={16}>
            <Flex alignItems="center" justifyContent="space-between" mb={6}>
              <Heading as="h2" size="lg" color="text.default" fontFamily="heading">
                Категорії
              </Heading>
              <Link
                href={routes.catalog}
                style={{
                  color: "var(--chakra-colors-accent-default)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Всі категорії →
              </Link>
            </Flex>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={4}>
              {categories.map((cat) => (
                <Link key={cat._id} href={routes.category(cat.slug.current)} style={{ textDecoration: "none" }}>
                  <Box
                    borderRadius="card"
                    overflow="hidden"
                    bg="bg.card"
                    shadow="card"
                    p={4}
                    textAlign="center"
                    _hover={{ shadow: "md", transform: "translateY(-3px)" }}
                    transition="all 0.2s"
                    cursor="pointer"
                    h="100%"
                  >
                    {cat.image && (
                      <Box
                        position="relative"
                        mb={3}
                        borderRadius="md"
                        overflow="hidden"
                        sx={{ aspectRatio: "1 / 1" }}
                      >
                        <NextImage
                          src={urlFor(cat.image).width(300).height(300).url()}
                          alt={cat.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </Box>
                    )}
                    <Text fontWeight="medium" color="text.default">
                      {cat.name}
                    </Text>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Latest products */}
        <Flex alignItems="center" justifyContent="space-between" mb={6}>
          <Heading as="h2" size="lg" color="text.default" fontFamily="heading">
            Нові надходження
          </Heading>
          <Link
            href={routes.catalog}
            style={{
              color: "var(--chakra-colors-accent-default)",
              fontSize: "0.9rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Дивитись всі →
          </Link>
        </Flex>
        <ProductGrid products={latestProducts} />
      </Container>

    </Box>
  )
}
