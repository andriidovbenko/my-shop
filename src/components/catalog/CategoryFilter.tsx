"use client"
import { Box, Button, HStack } from "@chakra-ui/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { Category } from "@/types"
import { routes } from "@/lib/routes"

interface Props {
  categories: Category[]
}

export function CategoryFilter({ categories }: Props) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  return (
    <Box overflowX="auto" py={4}>
      <HStack gap={2} minW="max-content">
        <Button
          as={Link}
          href={routes.catalog}
          size="sm"
          bg={!activeCategory ? "accent.default" : "transparent"}
          color={!activeCategory ? "white" : "accent.default"}
          borderWidth="1px"
          borderColor="accent.default"
          _hover={{ bg: "accent.default", color: "white" }}
        >
          Всі
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat._id}
            as={Link}
            href={routes.category(cat.slug.current)}
            size="sm"
            bg={activeCategory === cat.slug.current ? "accent.default" : "transparent"}
            color={activeCategory === cat.slug.current ? "white" : "accent.default"}
            borderWidth="1px"
            borderColor="accent.default"
            _hover={{ bg: "accent.default", color: "white" }}
          >
            {cat.name}
          </Button>
        ))}
      </HStack>
    </Box>
  )
}
