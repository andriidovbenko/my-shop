import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { writeClient } from "@/lib/sanity/client"
import { revalidatePath } from "next/cache"

const reviewSchema = z.object({
  productSlug: z.string().min(1),
  author: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(5).max(2000),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = reviewSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: "Невірні дані" }, { status: 400 })
    }

    const { productSlug, author, rating, body } = parsed.data

    await writeClient.create({
      _type: "productReview",
      productSlug,
      author,
      rating,
      body,
      approved: true,
      createdAt: new Date().toISOString(),
    })

    revalidatePath(`/product/${productSlug}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Review creation error:", err)
    return NextResponse.json({ error: "Помилка збереження відгуку" }, { status: 500 })
  }
}
