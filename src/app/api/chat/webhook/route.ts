import { NextRequest, NextResponse } from "next/server"
import { writeClient, client } from "@/lib/sanity/client"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token")
  if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const update = await req.json()
    const msg = update?.message

    if (!msg || !msg.message_thread_id || msg.from?.is_bot) {
      return NextResponse.json({ ok: true })
    }

    const groupId = process.env.TELEGRAM_SUPPORT_GROUP_ID
    if (String(msg.chat?.id) !== groupId && String(msg.chat?.id) !== `-100${groupId?.replace("-100", "")}`) {
      return NextResponse.json({ ok: true })
    }

    const topicId: number = msg.message_thread_id
    const text: string = msg.text || msg.caption || ""
    if (!text) return NextResponse.json({ ok: true })

    const session = await client.fetch(
      `*[_type == "chatSession" && topicId == $topicId][0]{ _id }`,
      { topicId }
    )
    if (!session) return NextResponse.json({ ok: true })

    await writeClient
      .patch(session._id)
      .append("messages", [{
        _key: crypto.randomUUID(),
        role: "bot",
        text,
        timestamp: new Date().toISOString(),
      }])
      .commit()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("chat/webhook error:", err)
    return NextResponse.json({ ok: true })
  }
}
