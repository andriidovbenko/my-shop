"use client"
import { Container, Heading, Text, Button } from "@chakra-ui/react"
import { useEffect } from "react"
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container maxW="md" py={20} textAlign="center">
      <Heading as="h1" size="2xl" mb={4} color="red.500">
        Помилка
      </Heading>
      <Text fontSize="lg" color="text.muted" mb={8}>
        Щось пішло не так. Спробуйте ще раз.
      </Text>
      <Button onClick={reset} bg="accent.default" color="white" _hover={{ bg: "accent.hover" }}>
        Спробувати знову
      </Button>
    </Container>
  )
}
