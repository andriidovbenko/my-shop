"use client"
import { useState } from "react"
import {
  Box, Button, FormControl, FormLabel, Input, Textarea,
  VStack, Text, Alert, AlertIcon,
} from "@chakra-ui/react"
import { StarRating } from "./StarRating"

export function ReviewForm({ productSlug, onSuccess }: { productSlug: string; onSuccess?: () => void }) {
  const [rating, setRating] = useState(0)
  const [author, setAuthor] = useState("")
  const [body, setBody] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!rating || !author.trim() || body.trim().length < 5) return

    setStatus("loading")
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, author: author.trim(), rating, body: body.trim() }),
      })
      if (!res.ok) throw new Error()
      setStatus("success")
      setRating(0)
      setAuthor("")
      setBody("")
      onSuccess?.()
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <Alert status="success" borderRadius="md">
        <AlertIcon />
        Дякуємо за ваш відгук!
      </Alert>
    )
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack align="stretch" gap={4}>
        <FormControl isRequired>
          <FormLabel color="text.default">Ваша оцінка</FormLabel>
          <StarRating rating={rating} interactive size={24} onChange={setRating} />
          {!rating && (
            <Text fontSize="xs" color="text.muted" mt={1}>
              Оберіть кількість зірок
            </Text>
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="text.default">Ваше ім&apos;я</FormLabel>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Як вас звати?"
            maxLength={100}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel color="text.default">Відгук</FormLabel>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Поділіться враженнями про товар..."
            rows={4}
            maxLength={2000}
            resize="vertical"
          />
        </FormControl>

        {status === "error" && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Сталася помилка. Спробуйте ще раз.
          </Alert>
        )}

        <Button
          type="submit"
          colorScheme="brand"
          isLoading={status === "loading"}
          isDisabled={!rating || !author.trim() || body.trim().length < 5}
          alignSelf="flex-start"
        >
          Надіслати відгук
        </Button>
      </VStack>
    </Box>
  )
}
