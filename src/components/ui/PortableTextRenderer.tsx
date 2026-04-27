"use client"
import type { ReactNode } from "react"
import { PortableText } from "@portabletext/react"
import type { PortableTextBlock, PortableTextMarkComponentProps } from "@portabletext/react"
import { Box, Text, UnorderedList, OrderedList, ListItem, Heading } from "@chakra-ui/react"

type WithChildren = { children?: ReactNode }
type LinkValue = { _type: string; href?: string; blank?: boolean }

const components = {
  block: {
    normal: ({ children }: WithChildren) => (
      <Text mb={3} color="text.default" lineHeight="tall">
        {children}
      </Text>
    ),
    h2: ({ children }: WithChildren) => (
      <Heading as="h2" size="md" mb={3} mt={5} color="text.default">
        {children}
      </Heading>
    ),
    h3: ({ children }: WithChildren) => (
      <Heading as="h3" size="sm" mb={2} mt={4} color="text.default">
        {children}
      </Heading>
    ),
    blockquote: ({ children }: WithChildren) => (
      <Box borderLeftWidth="3px" borderColor="accent.default" pl={4} my={4} color="text.muted" fontStyle="italic">
        {children}
      </Box>
    ),
  },
  list: {
    bullet: ({ children }: WithChildren) => (
      <UnorderedList mb={3} pl={4} color="text.default" spacing={1}>
        {children}
      </UnorderedList>
    ),
    number: ({ children }: WithChildren) => (
      <OrderedList mb={3} pl={4} color="text.default" spacing={1}>
        {children}
      </OrderedList>
    ),
  },
  listItem: {
    bullet: ({ children }: WithChildren) => <ListItem>{children}</ListItem>,
    number: ({ children }: WithChildren) => <ListItem>{children}</ListItem>,
  },
  marks: {
    strong: ({ children }: WithChildren) => <strong>{children}</strong>,
    em: ({ children }: WithChildren) => <em>{children}</em>,
    code: ({ children }: WithChildren) => (
      <Box as="code" bg="gray.100" px={1} borderRadius="sm" fontSize="sm" fontFamily="mono">
        {children}
      </Box>
    ),
    link: ({ value, children }: PortableTextMarkComponentProps<LinkValue>) => (
      <Box
        as="a"
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        color="accent.default"
        textDecoration="underline"
        _hover={{ color: "accent.hover" }}
      >
        {children}
      </Box>
    ),
  },
}

interface Props {
  value: PortableTextBlock[]
}

export function PortableTextRenderer({ value }: Props) {
  if (!value?.length) return null
  return (
    <Box>
      <PortableText value={value} components={components} />
    </Box>
  )
}
