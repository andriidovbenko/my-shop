import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "next-sanity"
import { sendTelegramMessage } from "@/lib/telegram"

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+380\d{9}$/),
  }),
  delivery: z.object({
    city: z.string().min(1),
    cityRef: z.string().min(1),
    deliveryType: z.enum(["warehouse", "postomat"]),
    warehouseRef: z.string().min(1),
    warehouseDescription: z.string().min(1),
  }),
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

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = orderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Невірні дані замовлення" }, { status: 400 })
    }

    const { customer, delivery, items, totalAmount } = parsed.data
    const orderNumber = generateOrderNumber()

    await sanityWriteClient.create({
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

    const deliveryLabel = delivery.deliveryType === "warehouse" ? "Відділення" : "Поштомат"
    const itemsList = items
      .map((i) => `${i.name} x ${i.quantity} — ${i.price} грн`)
      .join("\n")

    const message =
      `🛍 Нове замовлення #${orderNumber}\n\n` +
      `👤 Клієнт\n` +
      `Імʼя: ${customer.name}\n` +
      `Телефон: ${customer.phone}\n` +
      `Email: ${customer.email}\n\n` +
      `📦 Доставка\n` +
      `Місто: ${delivery.city}\n` +
      `${deliveryLabel}: ${delivery.warehouseDescription}\n\n` +
      `🛒 Товари\n${itemsList}\n\n` +
      `💰 Сума: ${totalAmount} грн\n` +
      `💳 Оплата: IBAN`

    // Non-blocking — order is already saved
    sendTelegramMessage(message)

    return NextResponse.json({ orderNumber })
  } catch (err) {
    console.error("Order creation error:", err)
    return NextResponse.json({ error: "Помилка створення замовлення" }, { status: 500 })
  }
}
