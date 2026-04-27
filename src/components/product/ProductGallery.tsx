"use client"
import { useState, useEffect, useCallback } from "react"
import { Box, HStack, Modal, ModalOverlay, ModalContent, ModalCloseButton, IconButton, useDisclosure } from "@chakra-ui/react"
import NextImage from "next/image"
import type { SanityImageSource } from "@sanity/image-url"
import { urlFor } from "@/lib/sanity/image"

interface ImageItem {
  asset: SanityImageSource
  alt: string
}

interface Props {
  images: ImageItem[]
  productName: string
}

export function ProductGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const active = images[activeIndex] ?? images[0]

  const openLightbox = () => {
    setLightboxIndex(activeIndex)
    onOpen()
  }

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, prev, next])

  if (!images.length) return null

  const lightboxImage = images[lightboxIndex] ?? images[0]

  return (
    <>
      <Box>
        {/* Main image — click to open lightbox */}
        <Box
          position="relative"
          w="100%"
          h={{ base: "300px", md: "450px" }}
          borderRadius="card"
          overflow="hidden"
          mb={3}
          shadow="card"
          cursor="zoom-in"
          onClick={openLightbox}
          sx={{ "&:hover img": { transform: "scale(1.03)" } }}
        >
          <NextImage
            src={urlFor(active.asset).width(600).height(600).url()}
            alt={active.alt || productName}
            fill
            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Zoom hint */}
          <Box
            position="absolute"
            bottom={2}
            right={2}
            bg="blackAlpha.500"
            color="white"
            borderRadius="md"
            px={2}
            py={1}
            fontSize="xs"
            pointerEvents="none"
          >
            🔍 Збільшити
          </Box>
        </Box>

        {/* Thumbnails */}
        {images.length > 1 && (
          <HStack gap={2} flexWrap="wrap">
            {images.map((img, i) => (
              <Box
                key={i}
                position="relative"
                w="72px"
                h="72px"
                borderRadius="md"
                overflow="hidden"
                cursor="pointer"
                border="2px solid"
                borderColor={i === activeIndex ? "accent.default" : "border.default"}
                onClick={() => setActiveIndex(i)}
                flexShrink={0}
                opacity={i === activeIndex ? 1 : 0.7}
                _hover={{ opacity: 1 }}
                transition="opacity 0.15s, border-color 0.15s"
              >
                <NextImage
                  src={urlFor(img.asset).width(150).height(150).url()}
                  alt={img.alt || productName}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="72px"
                />
              </Box>
            ))}
          </HStack>
        )}
      </Box>

      {/* Lightbox */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="transparent" shadow="none" mx={0} my={0} maxW="100vw" maxH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          {/* Close button — offset below sticky header */}
          <ModalCloseButton
            color="white"
            size="lg"
            top={20}
            right={6}
            bg="blackAlpha.600"
            borderRadius="full"
            _hover={{ bg: "blackAlpha.800" }}
          />

          {/* Nav + image row */}
          <Box display="flex" alignItems="center" justifyContent="center" w="100%" px={{ base: 2, md: 16 }} gap={4}>
            {/* Prev button */}
            {images.length > 1 && (
              <IconButton
                aria-label="Попереднє фото"
                icon={<span style={{ fontSize: "2rem", lineHeight: 1 }}>‹</span>}
                onClick={prev}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                size="lg"
                flexShrink={0}
              />
            )}

            {/* Full-size image */}
            <Box
              position="relative"
              flex="1"
              h={{ base: "60vw", md: "75vh" }}
              maxH="75vh"
              maxW="900px"
              borderRadius="lg"
              overflow="hidden"
            >
              <NextImage
                key={lightboxIndex}
                src={urlFor(lightboxImage.asset).width(1200).height(1200).url()}
                alt={lightboxImage.alt || productName}
                fill
                style={{ objectFit: "contain" }}
                sizes="90vw"
                priority
              />
            </Box>

            {/* Next button */}
            {images.length > 1 && (
              <IconButton
                aria-label="Наступне фото"
                icon={<span style={{ fontSize: "2rem", lineHeight: 1 }}>›</span>}
                onClick={next}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                size="lg"
                flexShrink={0}
              />
            )}
          </Box>

          {/* Dot indicators */}
          {images.length > 1 && (
            <HStack justify="center" mt={6} gap={2}>
              {images.map((_, i) => (
                <Box
                  key={i}
                  w={i === lightboxIndex ? "24px" : "8px"}
                  h="8px"
                  borderRadius="full"
                  bg={i === lightboxIndex ? "white" : "whiteAlpha.500"}
                  cursor="pointer"
                  onClick={() => setLightboxIndex(i)}
                  transition="all 0.2s"
                />
              ))}
            </HStack>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
