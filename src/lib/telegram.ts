export async function sendTelegramMessage(text: string): Promise<void> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) {
      console.warn("Telegram credentials not configured")
      return
    }
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error("Telegram sendMessage failed:", res.status, body)
    }
  } catch (err) {
    console.error("Telegram error:", err)
  }
}

function getSupportGroupCredentials() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const groupId = process.env.TELEGRAM_SUPPORT_GROUP_ID
  if (!token || !groupId) throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_SUPPORT_GROUP_ID not configured")
  return { token, groupId }
}

export async function createForumTopic(name: string): Promise<number> {
  const { token, groupId } = getSupportGroupCredentials()
  const res = await fetch(`https://api.telegram.org/bot${token}/createForumTopic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: groupId, name }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(`createForumTopic failed: ${JSON.stringify(data)}`)
  return data.result.message_thread_id
}

export async function sendMessageToTopic(threadId: number, text: string): Promise<void> {
  const { token, groupId } = getSupportGroupCredentials()
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: groupId, message_thread_id: threadId, text }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error("sendMessageToTopic failed:", res.status, body)
  }
}
