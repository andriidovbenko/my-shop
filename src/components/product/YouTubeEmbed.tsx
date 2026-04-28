"use client"

import { Box, Heading } from "@chakra-ui/react"

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

interface YouTubeEmbedProps {
  url: string
  title: string
}

export function YouTubeEmbed({ url, title }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url)
  if (!videoId) return null

  return (
    <Box mt={12}>
      <Heading as="h2" size="md" mb={4} color="text.default">
        Відео про товар
      </Heading>
      <Box
        position="relative"
        w="100%"
        style={{ paddingBottom: "56.25%" }}
        borderRadius="lg"
        overflow="hidden"
        bg="black"
      >
        <Box
          as="iframe"
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          border="none"
        />
      </Box>
    </Box>
  )
}
