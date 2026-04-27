"use client"
import { HStack, IconButton, Text } from "@chakra-ui/react"

interface Props {
  quantity: number
  onChange: (qty: number) => void
}

export function QuantitySelector({ quantity, onChange }: Props) {
  return (
    <HStack gap={2}>
      <IconButton
        aria-label="Зменшити кількість"
        icon={<span>−</span>}
        size="sm"
        variant="outline"
        borderColor="accent.default"
        color="accent.default"
        _hover={{ bg: "accent.default", color: "white" }}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        isDisabled={quantity <= 1}
      />
      <Text minW="2.5rem" textAlign="center" fontWeight="semibold" fontSize="lg">
        {quantity}
      </Text>
      <IconButton
        aria-label="Збільшити кількість"
        icon={<span>+</span>}
        size="sm"
        variant="outline"
        borderColor="accent.default"
        color="accent.default"
        _hover={{ bg: "accent.default", color: "white" }}
        onClick={() => onChange(quantity + 1)}
      />
    </HStack>
  )
}
