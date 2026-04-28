import { Box, Container, Flex, Text, VStack, Divider, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export function Footer() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const telegram = process.env.NEXT_PUBLIC_CONTACT_TELEGRAM;
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "3Dиво";

  return (
    <Box as="footer" bg="dark.900" color="white" mt="auto">
      {/* Gradient accent line at top */}
      <Box h="2px" bgGradient="linear(to-r, #1A8FE3, #F5821F)" />

      <Container maxW="7xl" py={12}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={10}>
          {/* Brand */}
          <VStack align="flex-start" gap={3}>
            <Text fontSize="xl" fontWeight="800" letterSpacing="tight">
              {siteName}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.600" lineHeight="tall" maxW="220px">
              Унікальні вироби з 3D-друку — готові до відправки по всій Україні
            </Text>
            {/* ДрукАрмія badge */}
            <Box
              as="a"
              href="https://drukar.me/hyz51d57"
              target="_blank"
              rel="noopener noreferrer"
              display="inline-flex"
              alignItems="center"
              gap={2}
              mt={1}
              px={3}
              py={1.5}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.200"
              bg="whiteAlpha.50"
              fontSize="xs"
              fontWeight="600"
              color="whiteAlpha.800"
              _hover={{ borderColor: "#1A8FE3", color: "white", bg: "whiteAlpha.100" }}
              transition="all 0.2s"
            >
              🇺🇦 Друкуємо для ЗСУ безкоштовно
            </Box>
          </VStack>

          {/* Navigation */}
          <VStack align="flex-start" gap={1}>
            <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" letterSpacing="widest" textTransform="uppercase" mb={2}>
              Навігація
            </Text>
            {[
              { label: "Каталог", href: routes.catalog },
              { label: "Про нас", href: routes.about },
              { label: "Кошик", href: routes.cart },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <Text
                  fontSize="sm"
                  color="whiteAlpha.700"
                  py={0.5}
                  _hover={{ color: "white" }}
                  transition="color 0.15s"
                >
                  {label}
                </Text>
              </Link>
            ))}
          </VStack>

          {/* Contacts */}
          <VStack align="flex-start" gap={1}>
            <Text fontSize="xs" fontWeight="700" color="whiteAlpha.400" letterSpacing="widest" textTransform="uppercase" mb={2}>
              Контакти
            </Text>
            {phone && (
              <Box as="a" href={"tel:" + phone} fontSize="sm" color="whiteAlpha.700" _hover={{ color: "white" }} transition="color 0.15s" py={0.5}>
                📞 {phone}
              </Box>
            )}
            {email && (
              <Box as="a" href={"mailto:" + email} fontSize="sm" color="whiteAlpha.700" _hover={{ color: "white" }} transition="color 0.15s" py={0.5}>
                ✉️ {email}
              </Box>
            )}
            {telegram && (
              <Box
                as="a"
                href={"https://t.me/" + telegram.replace("@", "")}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="sm"
                color="#1A8FE3"
                _hover={{ color: "#60b4f5" }}
                transition="color 0.15s"
                py={0.5}
              >
                💬 {telegram}
              </Box>
            )}
            {!phone && !email && !telegram && (
              <Box
                as="button"
                fontSize="sm"
                color="whiteAlpha.700"
                _hover={{ color: "white" }}
                transition="color 0.15s"
                onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
                cursor="pointer"
                textAlign="left"
                py={0.5}
              >
                💬 Чат на сайті
              </Box>
            )}
          </VStack>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" mt={10} mb={6} />

        {/* Bottom bar */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap={3}
          fontSize="xs"
          color="whiteAlpha.600"
        >
          <Text>© {new Date().getFullYear()} {siteName}. Всі права захищено.</Text>
          <Flex gap={4} wrap="wrap">
            <Link href={routes.privacy} style={{ textDecoration: "none" }}>
              <Text color="whiteAlpha.600" _hover={{ color: "whiteAlpha.700" }} transition="color 0.15s">
                Політика конфіденційності
              </Text>
            </Link>
            <Link href={routes.offer} style={{ textDecoration: "none" }}>
              <Text color="whiteAlpha.600" _hover={{ color: "whiteAlpha.700" }} transition="color 0.15s">
                Публічна оферта
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
