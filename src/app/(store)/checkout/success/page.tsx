import { Container } from "@chakra-ui/react"
import { OrderSuccess } from "@/components/checkout/OrderSuccess"
import { buildTitle } from "@/lib/metadata"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: buildTitle("Замовлення прийнято"),
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; name?: string; total?: string }>
}) {
  const { order = "", name = "", total = "0" } = await searchParams

  return (
    <Container maxW="3xl" py={12}>
      <OrderSuccess orderNumber={order} name={name} total={total} />
    </Container>
  )
}
