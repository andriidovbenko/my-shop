import { NextRequest, NextResponse } from "next/server"
import { getWarehouses } from "@/lib/novaposhta"

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")
  if (!ref) {
    return NextResponse.json({ error: "ref is required" }, { status: 400 })
  }
  try {
    const warehouses = await getWarehouses(ref)
    return NextResponse.json(warehouses)
  } catch (err) {
    console.error("NP warehouses error:", err)
    return NextResponse.json({ error: "Помилка завантаження відділень" }, { status: 500 })
  }
}
