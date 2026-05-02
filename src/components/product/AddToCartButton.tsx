"use client"
import { Button } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import { sendGAEvent } from "@next/third-parties/google"
import { useCart } from "@/context/CartContext"
import type { Product } from "@/types"

interface Props {
  product: Product
  quantity: number
}

export function AddToCartButton({ product, quantity }: Props) {
  const { addItem } = useCart()
  const toast = useToast()

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.asset,
      slug: product.slug.current,
    })
    sendGAEvent("event", "add_to_cart", {
      currency: "UAH",
      value: product.price * quantity,
      items: [{ item_id: product.slug.current, item_name: product.name, price: product.price, quantity }],
    })
    toast({
      title: "Товар додано в кошик",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    })
  }

  const inStock = product.inStock !== false

  return (
    <Button
      onClick={handleAdd}
      bg={inStock ? "accent.default" : "gray.300"}
      color="white"
      _hover={inStock ? { bg: "accent.hover" } : {}}
      size="lg"
      w="full"
      isDisabled={!inStock}
      cursor={inStock ? "pointer" : "not-allowed"}
    >
      {inStock ? "Додати в кошик" : "Немає в наявності"}
    </Button>
  )
}
