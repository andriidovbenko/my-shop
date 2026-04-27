import { Container, Heading, Text } from "@chakra-ui/react"
import { LinkButton } from "@/components/ui/LinkButton"
import { routes } from "@/lib/routes"

export default function NotFound() {
  return (
    <Container maxW="md" py={20} textAlign="center">
      <Heading as="h1" size="2xl" mb={4}>
        404
      </Heading>
      <Text fontSize="xl" color="text.muted" mb={8}>
        Сторінку не знайдено
      </Text>
      <LinkButton href={routes.catalog} bg="accent.default" color="white" _hover={{ bg: "accent.hover" }}>
        До каталогу
      </LinkButton>
    </Container>
  )
}
