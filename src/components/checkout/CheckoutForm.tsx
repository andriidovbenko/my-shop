"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { sendGAEvent } from "@next/third-parties/google"
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
  Checkbox,
} from "@chakra-ui/react"
import Link from "next/link"
import { z } from "zod"
import { useCart } from "@/context/CartContext"
import { DeliverySelector, type DeliveryValue } from "./DeliverySelector"
import { routes } from "@/lib/routes"
import type { MessengerType } from "@/types"
import { FaViber, FaTelegramPlane, FaWhatsapp } from "react-icons/fa"

const customerSchema = z.object({
  firstName: z.string().min(2, "Мінімум 2 символи"),
  lastName: z.string().min(2, "Мінімум 2 символи"),
  email: z.string().email("Невірний формат email"),
  phone: z.string().regex(/^\+380\d{9}$/, "Формат: +380XXXXXXXXX"),
  messenger: z.enum(["viber", "telegram", "whatsapp"], { message: "Оберіть месенджер" }),
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

const MESSENGERS: { value: MessengerType; label: string; Icon: React.ElementType; color: string }[] = [
  { value: "viber", label: "Viber", Icon: FaViber, color: "#7360F2" },
  { value: "telegram", label: "Telegram", Icon: FaTelegramPlane, color: "#2AABEE" },
  { value: "whatsapp", label: "WhatsApp", Icon: FaWhatsapp, color: "#25D366" },
]

const CARD_PROPS = {
  p: 6,
  borderWidth: "1px" as const,
  borderColor: "border.default",
  borderRadius: "card",
  bg: "white",
  shadow: "card",
}

export function CheckoutForm() {
  const router = useRouter()
  const { items, totalPrice } = useCart()

  useEffect(() => {
    sendGAEvent("event", "begin_checkout", {
      currency: "UAH",
      value: totalPrice,
      items: items.map((i) => ({ item_id: i.slug, item_name: i.name, price: i.price, quantity: i.quantity })),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [customer, setCustomer] = useState<CustomerFields>({ firstName: "", lastName: "", email: "", phone: "", messenger: "viber" })
  const [delivery, setDelivery] = useState<DeliveryValue>(emptyDelivery)
  const [customerErrors, setCustomerErrors] = useState<CustomerErrors>({})
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")
  const [offerAccepted, setOfferAccepted] = useState(false)
  const [offerError, setOfferError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isFormValid = (): boolean => {
    if (!customerSchema.safeParse(customer).success) return false
    if (!delivery.city) return false
    if (delivery.carrier === "novaposhta") {
      if (delivery.deliveryType === "courier") {
        if (!delivery.streetAddress.trim()) return false
      } else {
        if (!delivery.warehouseRef) return false
      }
    } else {
      if (!/^\d{5}$/.test(delivery.postIndex)) return false
      if (delivery.deliveryMethod === "courier" && !delivery.streetAddress.trim()) return false
    }
    return offerAccepted
  }

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

    if (!offerAccepted) setOfferError(true)

    return (
      Object.keys(newCustomerErrors).length === 0 &&
      Object.keys(newDeliveryErrors).length === 0 &&
      offerAccepted
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
        `/checkout/success?order=${encodeURIComponent(data.orderNumber)}&name=${encodeURIComponent(customer.firstName)}&total=${totalPrice}`
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
      <Box display={{ base: "block", lg: "flex" }} gap={8} alignItems="start">
        {/* Left: customer + delivery */}
        <VStack flex="1" align="stretch" gap={5}>

          {/* Contact section */}
          <Box {...CARD_PROPS}>
            <Heading as="h2" size="md" mb={5} color="text.default">
              Контактні дані
            </Heading>
            <VStack gap={4}>
              <HStack gap={4} align="start" w="full">
                <FormControl isInvalid={!!customerErrors.firstName}>
                  <FormLabel color="text.default" fontSize="sm" fontWeight="500">Імʼя</FormLabel>
                  <Input
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    placeholder="Іван"
                    borderColor="border.default"
                    _focus={{ borderColor: "accent.default", boxShadow: "none" }}
                  />
                  <FormErrorMessage>{customerErrors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!customerErrors.lastName}>
                  <FormLabel color="text.default" fontSize="sm" fontWeight="500">Прізвище</FormLabel>
                  <Input
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    placeholder="Іваненко"
                    borderColor="border.default"
                    _focus={{ borderColor: "accent.default", boxShadow: "none" }}
                  />
                  <FormErrorMessage>{customerErrors.lastName}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!customerErrors.email}>
                <FormLabel color="text.default" fontSize="sm" fontWeight="500">Email</FormLabel>
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
                <FormLabel color="text.default" fontSize="sm" fontWeight="500">Телефон</FormLabel>
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

              <FormControl isInvalid={!!customerErrors.messenger}>
                <FormLabel color="text.default" fontSize="sm" fontWeight="500" mb={3}>
                  Зручний месенджер для зв&apos;язку
                </FormLabel>
                <HStack gap={3}>
                  {MESSENGERS.map(({ value, label, Icon, color }) => {
                    const selected = customer.messenger === value
                    return (
                      <Box
                        key={value}
                        as="button"
                        type="button"
                        onClick={() => setCustomer({ ...customer, messenger: value })}
                        flex={1}
                        py={4}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={2}
                        borderWidth="2px"
                        borderColor={selected ? color : "gray.200"}
                        borderRadius="xl"
                        bg={selected ? `${color}12` : "white"}
                        cursor="pointer"
                        transition="all 0.15s"
                        _hover={{ borderColor: color }}
                      >
                        <Icon color={color} size={26} />
                        <Text
                          fontSize="xs"
                          fontWeight={selected ? "600" : "400"}
                          color={selected ? "gray.800" : "gray.500"}
                        >
                          {label}
                        </Text>
                      </Box>
                    )
                  })}
                </HStack>
                <FormErrorMessage>{customerErrors.messenger}</FormErrorMessage>
              </FormControl>
            </VStack>
          </Box>

          {/* Delivery section */}
          <Box {...CARD_PROPS}>
            <Heading as="h2" size="md" mb={5} color="text.default">
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
          mt={{ base: 5, lg: 0 }}
          flexShrink={0}
          position={{ lg: "sticky" }}
          top={{ lg: "24px" }}
          {...CARD_PROPS}
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

          <FormControl isInvalid={offerError} mb={4}>
            <Checkbox
              isChecked={offerAccepted}
              onChange={(e) => {
                setOfferAccepted(e.target.checked)
                if (e.target.checked) setOfferError(false)
              }}
              colorScheme="brand"
              alignItems="flex-start"
            >
              <Text fontSize="sm" color="text.default" lineHeight="1.4">
                Я ознайомився(-лась) та погоджуюсь з умовами{" "}
                <Text
                  as={Link}
                  href={routes.offer}
                  target="_blank"
                  color="accent.default"
                  textDecoration="underline"
                  _hover={{ color: "accent.hover" }}
                >
                  публічної оферти
                </Text>
              </Text>
            </Checkbox>
            <FormErrorMessage>Необхідно погодитися з умовами оферти</FormErrorMessage>
          </FormControl>

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
            isDisabled={submitted && !isFormValid()}
            loadingText="Оформлення..."
          >
            Підтвердити замовлення
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
