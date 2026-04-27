import { NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/sanity/client"

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId")
  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 })

  try {
    const session = await client.fetch(
      `*[_type == "chatSession" && sessionId == $sessionId][0]{ messages }`,
      { sessionId }
    )
    return NextResponse.json({ messages: session?.messages ?? [] })
  } catch (err) {
    console.error("chat/messages error:", err)
    return NextResponse.json({ error: "Помилка отримання повідомлень" }, { status: 500 })
  }
}
