import { Container, Heading } from "@chakra-ui/react"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Оформлення замовлення"),
}

export default function CheckoutPage() {
  return (
    <Container maxW="6xl" py={8}>
      <Heading as="h1" size="xl" mb={8} color="text.default">
        Оформлення замовлення
      </Heading>
      <CheckoutForm />
    </Container>
  )
}
