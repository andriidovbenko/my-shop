import { Container, Heading } from "@chakra-ui/react"
import { CartPageContent } from "@/components/cart/CartPageContent"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Кошик"),
}

export default function CartPage() {
  const breadcrumbs = [
    { label: "Головна", href: "/" },
    { label: "Кошик" },
  ]

  return (
    <Container maxW="5xl" py={8}>
      <Breadcrumbs items={breadcrumbs} />
      <Heading as="h1" size="xl" mb={8} color="text.default" fontFamily="heading">
        Кошик
      </Heading>
      <CartPageContent />
    </Container>
  )
}
