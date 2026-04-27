import { NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity/client"
import { createForumTopic } from "@/lib/telegram"

export async function POST() {
  try {
    const sessionId = crypto.randomUUID()
    const now = new Date().toISOString()
    const topicName = `Чат ${new Date().toLocaleDateString("uk-UA")} #${sessionId.slice(0, 6)}`

    const topicId = await createForumTopic(topicName)

    await writeClient.create({
      _type: "chatSession",
      sessionId,
      topicId,
      createdAt: now,
      messages: [],
    })

    return NextResponse.json({ sessionId })
  } catch (err) {
    console.error("chat/start error:", err)
    return NextResponse.json({ error: "Не вдалося розпочати чат" }, { status: 500 })
  }
}
