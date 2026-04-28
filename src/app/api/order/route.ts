import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { writeClient } from "@/lib/sanity/client"
import { sendTelegramMessage } from "@/lib/telegram"

const npDeliverySchema = z.object({
  carrier: z.literal("novaposhta"),
  city: z.string().min(1),
  cityRef: z.string().min(1),
  deliveryType: z.enum(["warehouse", "postomat", "courier"]),
  warehouseRef: z.string().optional(),
  warehouseDescription: z.string().optional(),
  streetAddress: z.string().optional(),
})

const upDeliverySchema = z.object({
  carrier: z.literal("ukrposhta"),
  city: z.string().min(1),
  postIndex: z.string().regex(/^\d{5}$/),
  deliveryMethod: z.enum(["post_office", "courier"]),
  streetAddress: z.string().optional(),
})

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+380\d{9}$/),
    messenger: z.enum(["viber", "telegram", "whatsapp"]),
  }),
  delivery: z.discriminatedUnion("carrier", [npDeliverySchema, upDeliverySchema]),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().min(0),
    })
  ).min(1),
  totalAmount: z.number().min(0),
})

function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, "")
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `UA-${date}-${rand}`
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = orderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Невірні дані замовлення" }, { status: 400 })
    }

    const { customer, delivery, items, totalAmount } = parsed.data
    const orderNumber = generateOrderNumber()

    await writeClient.create({
      _type: "order",
      orderNumber,
      status: "pending_payment",
      customer,
      delivery,
      items: items.map((item) => ({
        _key: item.productId,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      createdAt: new Date().toISOString(),
    })

    const itemsList = items
      .map((i) => `${i.name} x ${i.quantity} — ${i.price} грн`)
      .join("\n")

    let deliveryText: string
    if (delivery.carrier === "novaposhta" && delivery.deliveryType === "courier") {
      deliveryText =
        `Служба: Нова Пошта (Кур'єр)\n` +
        `Місто: ${delivery.city}\n` +
        `Адреса: ${delivery.streetAddress ?? ""}`
    } else if (delivery.carrier === "novaposhta") {
      const label = delivery.deliveryType === "warehouse" ? "Відділення" : "Поштомат"
      deliveryText =
        `Служба: Нова Пошта\n` +
        `Місто: ${delivery.city}\n` +
        `${label}: ${delivery.warehouseDescription ?? ""}`
    } else if (delivery.deliveryMethod === "post_office") {
      deliveryText =
        `Служба: Укрпошта\n` +
        `Місто: ${delivery.city}\n` +
        `Індекс: ${delivery.postIndex}\n` +
        `Спосіб: Відділення`
    } else {
      deliveryText =
        `Служба: Укрпошта (Кур'єр)\n` +
        `Місто: ${delivery.city}\n` +
        `Індекс: ${delivery.postIndex}\n` +
        `Адреса: ${delivery.streetAddress ?? ""}`
    }

    const messengerLabel = { viber: "Viber", telegram: "Telegram", whatsapp: "WhatsApp" }

    const message =
      `🛍 Нове замовлення #${orderNumber}\n\n` +
      `👤 Клієнт\n` +
      `Імʼя: ${customer.firstName} ${customer.lastName}\n` +
      `Телефон: ${customer.phone}\n` +
      `Email: ${customer.email}\n` +
      `Месенджер: ${messengerLabel[customer.messenger]}\n\n` +
      `📦 Доставка\n${deliveryText}\n\n` +
      `🛒 Товари\n${itemsList}\n\n` +
      `💰 Сума: ${totalAmount} грн\n` +
      `💳 Оплата: IBAN`

    // TODO: Sanity order storage can be removed once confirmed stable —
    // all order data is already sent to Telegram. If removed, await this call
    // and return an error to the customer on failure (Telegram becomes single source of truth).
    sendTelegramMessage(message)

    return NextResponse.json({ orderNumber })
  } catch (err) {
    console.error("Order creation error:", err)
    return NextResponse.json({ error: "Помилка створення замовлення" }, { status: 500 })
  }
}
