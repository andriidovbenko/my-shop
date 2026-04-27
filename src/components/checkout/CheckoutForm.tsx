"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Divider,
  Text,
} from "@chakra-ui/react"
import Link from "next/link"
import { z } from "zod"
import { useCart } from "@/context/CartContext"
import { DeliverySelector, type DeliveryValue } from "./DeliverySelector"
import { routes } from "@/lib/routes"

const customerSchema = z.object({
  name: z.string().min(2, "Мінімум 2 символи"),
  email: z.string().email("Невірний формат email"),
  phone: z.string().regex(/^\+380\d{9}$/, "Формат: +380XXXXXXXXX"),
})

type CustomerFields = z.infer<typeof customerSchema>
type CustomerErrors = Partial<Record<keyof CustomerFields, string>>
type DeliveryErrors = Partial<Record<keyof DeliveryValue, string>>

const emptyDelivery: DeliveryValue = {
  carrier: "novaposhta",
  city: "",
  cityRef: "",
  deliveryType: "warehouse",
  warehouseRef: "",
  warehouseDescription: "",
  deliveryMethod: "post_office",
  postIndex: "",
  streetAddress: "",
}

export function CheckoutForm() {
  const router = useRouter()
  const { items, totalPrice } = useCart()

  const [customer, setCustomer] = useState<CustomerFields>({ name: "", email: "", phone: "" })
  const [delivery, setDelivery] = useState<DeliveryValue>(emptyDelivery)
  const [customerErrors, setCustomerErrors] = useState<CustomerErrors>({})
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")

  const validate = (): boolean => {
    const customerResult = customerSchema.safeParse(customer)
    const newCustomerErrors: CustomerErrors = {}
    if (!customerResult.success) {
      for (const issue of customerResult.error.issues) {
        const field = issue.path[0] as keyof CustomerFields
        newCustomerErrors[field] = issue.message
      }
    }

    const newDeliveryErrors: DeliveryErrors = {}
    if (!delivery.city) newDeliveryErrors.city = "Вкажіть місто"
    if (delivery.carrier === "novaposhta") {
      if (delivery.deliveryType === "courier") {
        if (!delivery.streetAddress.trim()) newDeliveryErrors.streetAddress = "Вкажіть адресу доставки"
      } else {
        if (!delivery.warehouseRef) newDeliveryErrors.warehouseRef = "Оберіть відділення"
      }
    } else {
      if (!/^\d{5}$/.test(delivery.postIndex)) newDeliveryErrors.postIndex = "Введіть 5-значний індекс"
      if (delivery.deliveryMethod === "courier" && !delivery.streetAddress.trim())
        newDeliveryErrors.streetAddress = "Вкажіть адресу доставки"
    }

    setCustomerErrors(newCustomerErrors)
    setDeliveryErrors(newDeliveryErrors)

    return (
      Object.keys(newCustomerErrors).length === 0 &&
      Object.keys(newDeliveryErrors).length === 0
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setServerError("")

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          delivery,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: totalPrice,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error || "Помилка створення замовлення")
        return
      }

      router.push(
        `/checkout/success?order=${encodeURIComponent(data.orderNumber)}&name=${encodeURIComponent(customer.name)}&total=${totalPrice}`
      )
    } catch {
      setServerError("Помилка мережі. Спробуйте ще раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={16}>
        <Text color="text.muted" mb={4}>Кошик порожній</Text>
        <Button as={Link} href={routes.catalog} bg="accent.default" color="white" _hover={{ bg: "accent.hover" }}>
          До каталогу
        </Button>
      </Box>
    )
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Box display={{ base: "block", lg: "flex" }} gap={10} alignItems="start">
        {/* Left: customer + delivery */}
        <VStack flex="1" align="stretch" gap={6}>
          <Box>
            <Heading as="h2" size="md" mb={4} color="text.default">
              Контактні дані
            </Heading>
            <VStack gap={4}>
              <FormControl isInvalid={!!customerErrors.name}>
                <FormLabel color="text.default">Імʼя та прізвище</FormLabel>
                <Input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Іван Іваненко"
                  borderColor="border.default"
                  _focus={{ borderColor: "accent.default", boxShadow: "none" }}
                />
                <FormErrorMessage>{customerErrors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!customerErrors.email}>
                <FormLabel color="text.default">Email</FormLabel>
                <Input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="email@example.com"
                  borderColor="border.default"
                  _focus={{ borderColor: "accent.default", boxShadow: "none" }}
                />
                <FormErrorMessage>{customerErrors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!customerErrors.phone}>
                <FormLabel color="text.default">Телефон</FormLabel>
                <Input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+380XXXXXXXXX"
                  borderColor="border.default"
                  _focus={{ borderColor: "accent.default", boxShadow: "none" }}
                />
                <FormErrorMessage>{customerErrors.phone}</FormErrorMessage>
              </FormControl>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={4} color="text.default">
              Доставка
            </Heading>
            <DeliverySelector
              value={delivery}
              onChange={setDelivery}
              errors={deliveryErrors}
            />
          </Box>
        </VStack>

        {/* Right: order summary */}
        <Box
          w={{ base: "full", lg: "340px" }}
          mt={{ base: 8, lg: 0 }}
          flexShrink={0}
          p={6}
          borderWidth="1px"
          borderColor="border.default"
          borderRadius="card"
          bg="bg.card"
          shadow="card"
        >
          <Heading as="h2" size="md" mb={4} color="text.default">
            Ваше замовлення
          </Heading>
          <VStack align="stretch" gap={2} mb={4}>
            {items.map((item) => (
              <HStack key={item.productId} justify="space-between" fontSize="sm">
                <Text color="text.default" noOfLines={1} flex="1">
                  {item.name} × {item.quantity}
                </Text>
                <Text color="text.default" flexShrink={0}>
                  {item.price * item.quantity} ₴
                </Text>
              </HStack>
            ))}
          </VStack>
          <Divider borderColor="border.default" mb={4} />
          <HStack justify="space-between" mb={6}>
            <Text fontWeight="bold" color="text.default">Разом:</Text>
            <Text fontWeight="bold" fontSize="xl" color="accent.default">
              {totalPrice} ₴
            </Text>
          </HStack>

          {serverError && (
            <Text color="red.500" fontSize="sm" mb={3}>{serverError}</Text>
          )}

          <Button
            type="submit"
            bg="accent.default"
            color="white"
            _hover={{ bg: "accent.hover" }}
            size="lg"
            w="full"
            isLoading={isSubmitting}
            loadingText="Оформлення..."
          >
            Підтвердити замовлення
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
