"use client"
import { Box, Text, VStack, Divider, useToast } from "@chakra-ui/react"

interface Field {
  label: string
  value: string
}

export function PaymentFields({ fields }: { fields: Field[] }) {
  const toast = useToast()

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast({
        description: `Скопійовано: ${value}`,
        status: "success",
        duration: 2000,
        isClosable: false,
        position: "top",
      })
    })
  }

  return (
    <VStack align="stretch" gap={0} divider={<Divider borderColor="border.default" />}>
      {fields.map(({ label, value }) => (
        <Box
          key={label}
          py={3}
          px={2}
          mx={-2}
          borderRadius="md"
          cursor="pointer"
          _hover={{ bg: "gray.50" }}
          transition="background 0.15s"
          onClick={() => handleCopy(value)}
        >
          <Text fontSize="xs" color="text.muted" mb={1}>{label}</Text>
          <Text fontWeight="600" color="text.default" wordBreak="break-all">{value}</Text>
        </Box>
      ))}
    </VStack>
  )
}
