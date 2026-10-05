import { NextRequest, NextResponse } from "next/server"
import { writeClient, client } from "@/lib/sanity/client"
import { sendMessageToTopic, sendTelegramMessage } from "@/lib/telegram"
import { sendEmail } from "@/lib/resend"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, text } = await req.json()
    if (!sessionId || !text?.trim()) {
      return NextResponse.json({ error: "Невірні дані" }, { status: 400 })
    }

    const session = await client.fetch(
      `*[_type == "chatSession" && sessionId == $sessionId][0]{ _id, topicId }`,
      { sessionId }
    )
    if (!session) {
      return NextResponse.json({ error: "Сесію не знайдено" }, { status: 404 })
    }

    const timestamp = new Date().toISOString()

    const groupNumericId = process.env.TELEGRAM_SUPPORT_GROUP_ID?.replace("-100", "")
    const topicLink = `https://t.me/c/${groupNumericId}/${session.topicId}`

    // Send notifications first (critical path)
    await Promise.all([
      sendMessageToTopic(session.topicId, text.trim()),
      sendEmail(text.trim(), 'Нове повідомлення в чаті'),
      sendTelegramMessage(`💬 Нове повідомлення в чаті:\n${text.trim()}\n\n👉 ${topicLink}`),
    ])

    // Save to Sanity asynchronously without blocking response
    writeClient
      .patch(session._id)
      .append("messages", [{ _key: crypto.randomUUID(), role: "user", text: text.trim(), timestamp }])
      .commit()
      .catch((err) => {
        console.error("Failed to save message to Sanity:", err)
      })

    return NextResponse.json({ ok: true, timestamp })
  } catch (err) {
    console.error("chat/message error:", err)
    return NextResponse.json({ error: "Помилка надсилання" }, { status: 500 })
  }
}
