import { Container, SimpleGrid, Skeleton, Box } from "@chakra-ui/react"

export default function CatalogLoading() {
  return (
    <Container maxW="7xl" py={8}>
      <Skeleton h="24px" w="200px" mb={4} />
      <Skeleton h="40px" w="300px" mb={4} />
      <Box overflowX="auto" py={4} mb={6}>
        <SimpleGrid columns={5} gap={2}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} h="32px" borderRadius="md" />
          ))}
        </SimpleGrid>
      </Box>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i} borderRadius="12px" overflow="hidden">
            <Skeleton h="200px" />
            <Box p={4}>
              <Skeleton h="16px" mb={2} />
              <Skeleton h="20px" w="80px" mb={3} />
              <Skeleton h="32px" />
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  )
}
