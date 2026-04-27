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
