import { Box, Container, Flex } from "@chakra-ui/react"
import Link from "next/link"
import NextImage from "next/image"
import { CartIcon } from "./CartIcon"
import { routes } from "@/lib/routes"

export function Header() {
  return (
    <Box as="header" bg="bg.default" borderBottomWidth="1px" borderColor="border.default" py={2} shadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="7xl">
        <Flex alignItems="center" justifyContent="space-between">
          <Link href={routes.home} style={{ textDecoration: "none" }}>
            <NextImage
              src="/logo.png"
              alt="3Dиво"
              width={240}
              height={120}
              style={{ objectFit: "contain", width: "auto", height: "120px" }}
              priority
            />
          </Link>

          <Flex gap={6} alignItems="center">
            <Link href={routes.catalog} style={{ color: "var(--chakra-colors-text-default)", textDecoration: "none", fontWeight: 500 }}>
              Каталог
            </Link>
            <Link href={routes.about} style={{ color: "var(--chakra-colors-text-default)", textDecoration: "none", fontWeight: 500 }}>
              Про нас
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
