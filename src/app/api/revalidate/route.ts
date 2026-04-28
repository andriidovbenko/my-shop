import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")
  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { _type } = body

    if (_type === "product") {
      revalidatePath("/catalog")
      revalidatePath("/")
      revalidatePath("/product/[slug]", "page")
    } else if (_type === "category") {
      revalidatePath("/catalog")
      revalidatePath("/")
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch {
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 })
  }
}
