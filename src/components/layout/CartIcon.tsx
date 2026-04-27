"use client"
import { useSyncExternalStore } from "react"
import { Box } from "@chakra-ui/react"
import { useCart } from "@/context/CartContext"

const subscribe = () => () => {}

export function CartIcon() {
  const { totalItems } = useCart()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {mounted && totalItems > 0 && (
        <Box
          position="absolute"
          top="-8px"
          right="-8px"
          bg="accent.default"
          color="white"
          borderRadius="full"
          minW="18px"
          h="18px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="bold"
        >
          {totalItems}
        </Box>
      )}
    </Box>
  )
}
