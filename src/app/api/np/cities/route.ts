import { NextRequest, NextResponse } from "next/server"
import { searchCities } from "@/lib/novaposhta"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")
  if (!q || q.trim().length < 2) {
    return NextResponse.json([])
  }
  try {
    const cities = await searchCities(q.trim())
    return NextResponse.json(cities)
  } catch (err) {
    console.error("NP cities error:", err)
    return NextResponse.json({ error: "Помилка пошуку міст" }, { status: 500 })
  }
}
