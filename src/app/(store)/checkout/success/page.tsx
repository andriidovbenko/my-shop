import { Container } from "@chakra-ui/react"
import { OrderSuccess } from "@/components/checkout/OrderSuccess"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Замовлення прийнято"),
  robots: { index: false, follow: true },
  alternates: { canonical: "/checkout/success" },
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; total?: string }>
}) {
  const { order = "", total = "0" } = await searchParams

  return (
    <Container maxW="3xl" py={12}>
      <OrderSuccess orderNumber={order} total={total} />
    </Container>
  )
}
