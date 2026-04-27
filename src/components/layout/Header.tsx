import { Box, Container, Flex, Text } from "@chakra-ui/react"
import Link from "next/link"
import { CartIcon } from "./CartIcon"
import { routes } from "@/lib/routes"

export function Header() {
  return (
    <Box as="header" bg="bg.default" borderBottomWidth="1px" borderColor="border.default" py={4} shadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="7xl">
        <Flex alignItems="center" justifyContent="space-between">
          <Link href={routes.home} style={{ textDecoration: "none" }}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              fontFamily="heading"
              color="accent.default"
              letterSpacing="tight"
            >
              {process.env.NEXT_PUBLIC_SITE_NAME || "My Shop"}
            </Text>
          </Link>

          <Flex gap={6} alignItems="center">
            <Link href={routes.catalog} style={{ color: "var(--chakra-colors-text-default)", textDecoration: "none", fontWeight: 500 }}>
              Каталог
            </Link>
            <Link href={routes.about} style={{ color: "var(--chakra-colors-text-default)", textDecoration: "none", fontWeight: 500 }}>
              Про магазин
            </Link>
            <Link href={routes.cart} style={{ color: "var(--chakra-colors-text-default)", textDecoration: "none" }} aria-label="Кошик">
              <CartIcon />
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
