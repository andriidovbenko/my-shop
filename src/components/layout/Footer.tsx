import { Box, Container, Flex, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export function Footer() {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const telegram = process.env.NEXT_PUBLIC_CONTACT_TELEGRAM;

  return (
    <Box as="footer" borderTopWidth="1px" borderColor="border.default" py={8} mt="auto">
      <Container maxW="7xl">
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" gap={6}>
          <VStack align="flex-start" gap={2}>
            <Link href={routes.catalog} style={{ color: "inherit", textDecoration: "none" }}>
              Каталог
            </Link>
            <Link href={routes.about} style={{ color: "inherit", textDecoration: "none" }}>
              Про магазин
            </Link>
          </VStack>

          <VStack align="flex-start" gap={2}>
            <Link href={routes.privacy} style={{ color: "inherit", textDecoration: "none" }}>
              Політика конфіденційності
            </Link>
            <Link href={routes.offer} style={{ color: "inherit", textDecoration: "none" }}>
              Публічна оферта
            </Link>
          </VStack>

          <VStack align="flex-start" gap={2}>
            {phone && (
              <Text fontSize="sm" color="text.muted">
                <a href={"tel:" + phone}>{phone}</a>
              </Text>
            )}
            {email && (
              <Text fontSize="sm" color="text.muted">
                <a href={"mailto:" + email}>{email}</a>
              </Text>
            )}
            {telegram && (
              <Text fontSize="sm" color="text.muted">
                <a href={"https://t.me/" + telegram.replace("@", "")} target="_blank" rel="noopener noreferrer">
                  {telegram}
                </a>
              </Text>
            )}
          </VStack>
        </Flex>

        <Text fontSize="sm" color="text.muted" mt={6} textAlign="center">
          {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || "My Shop"}. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
