import { Box, VStack, Heading, Text, HStack, Divider } from "@chakra-ui/react"
import { StarRating } from "./StarRating"
import { ReviewModal } from "./ReviewModal"
import type { ProductReview } from "@/types"

interface ReviewSectionProps {
  productSlug: string
  reviews: ProductReview[]
}

function pluralReviews(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return "відгук"
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "відгуки"
  return "відгуків"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function ReviewSection({ productSlug, reviews }: ReviewSectionProps) {
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <Box mt={12}>
      <Divider borderColor="border.default" mb={8} />
      <VStack align="stretch" gap={8}>
        <Box>
          <Heading as="h2" size="lg" color="text.default" mb={2}>
            Відгуки
          </Heading>
          {reviews.length > 0 && (
            <HStack gap={2} align="center">
              <StarRating rating={Math.round(avgRating)} size={18} />
              <Text color="text.muted" fontSize="sm">
                {avgRating.toFixed(1)} — {reviews.length} {pluralReviews(reviews.length)}
              </Text>
            </HStack>
          )}
        </Box>

        {reviews.length === 0 ? (
          <Text color="text.muted">Поки немає відгуків. Будьте першим!</Text>
        ) : (
          <VStack align="stretch" gap={4}>
            {reviews.map((review) => (
              <Box
                key={review._id}
                p={5}
                bg="bg.card"
                borderRadius="card"
                boxShadow="card"
                borderWidth="1px"
                borderColor="border.default"
              >
                <HStack justify="space-between" mb={2} flexWrap="wrap" gap={1}>
                  <Text fontWeight="semibold" color="text.default">
                    {review.author}
                  </Text>
                  <Text fontSize="xs" color="text.muted">
                    {formatDate(review.createdAt)}
                  </Text>
                </HStack>
                <StarRating rating={review.rating} size={14} />
                <Text mt={3} color="text.default" fontSize="sm" whiteSpace="pre-wrap">
                  {review.body}
                </Text>
              </Box>
            ))}
          </VStack>
        )}

        <Box>
          <ReviewModal productSlug={productSlug} />
        </Box>
      </VStack>
    </Box>
  )
}
