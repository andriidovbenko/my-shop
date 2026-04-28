"use client"
import { useRouter } from "next/navigation"
import {
  Button,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  useDisclosure,
} from "@chakra-ui/react"
import { ReviewForm } from "./ReviewForm"

export function ReviewModal({ productSlug }: { productSlug: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  function handleSuccess() {
    onClose()
    router.refresh()
  }

  return (
    <>
      <Button colorScheme="brand" onClick={onOpen}>
        Залишити відгук
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Залишити відгук</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ReviewForm productSlug={productSlug} onSuccess={handleSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
