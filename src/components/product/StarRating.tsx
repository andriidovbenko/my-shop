"use client"
import { useState } from "react"
import { HStack } from "@chakra-ui/react"
import { FaStar, FaRegStar } from "react-icons/fa"

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({ rating, max = 5, size = 16, interactive = false, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const displayed = interactive ? (hovered || rating) : rating

  return (
    <HStack gap={0.5} display="inline-flex">
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1
        const filled = value <= displayed
        return filled ? (
          <FaStar
            key={i}
            size={size}
            color="#F6AD55"
            style={{ cursor: interactive ? "pointer" : "default", flexShrink: 0 }}
            onClick={interactive ? () => onChange?.(value) : undefined}
            onMouseEnter={interactive ? () => setHovered(value) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
          />
        ) : (
          <FaRegStar
            key={i}
            size={size}
            color="#CBD5E0"
            style={{ cursor: interactive ? "pointer" : "default", flexShrink: 0 }}
            onClick={interactive ? () => onChange?.(value) : undefined}
            onMouseEnter={interactive ? () => setHovered(value) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
          />
        )
      })}
    </HStack>
  )
}
