import { NextRequest, NextResponse } from "next/server"
import { getPostomats } from "@/lib/novaposhta"

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")
  if (!ref) {
    return NextResponse.json({ error: "ref is required" }, { status: 400 })
  }
  try {
    const postomats = await getPostomats(ref)
    return NextResponse.json(postomats)
  } catch (err) {
    console.error("NP postomats error:", err)
    return NextResponse.json({ error: "Помилка завантаження поштоматів" }, { status: 500 })
  }
}
