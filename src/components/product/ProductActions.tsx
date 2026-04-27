"use client"
import { useState } from "react"
import { VStack } from "@chakra-ui/react"
import { QuantitySelector } from "./QuantitySelector"
import { AddToCartButton } from "./AddToCartButton"
import type { Product } from "@/types"

interface Props {
  product: Product
}

export function ProductActions({ product }: Props) {
  const [quantity, setQuantity] = useState(1)
  return (
    <VStack align="stretch" gap={3}>
      <QuantitySelector quantity={quantity} onChange={setQuantity} />
      <AddToCartButton product={product} quantity={quantity} />
    </VStack>
  )
}
