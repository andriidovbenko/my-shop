"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Spinner,
} from "@chakra-ui/react"
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa"

interface Message {
  _key: string
  role: "user" | "bot"
  text: string
  timestamp: string
}

const SESSION_KEY = "chat_session_id"
const POLL_INTERVAL = 3000

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) setSessionId(stored)
  }, [])

  const fetchMessages = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sid}`)
      const data = await res.json()
      if (Array.isArray(data.messages)) setMessages(data.messages)
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (isOpen && sessionId) {
      fetchMessages(sessionId)
      pollRef.current = setInterval(() => fetchMessages(sessionId), POLL_INTERVAL)
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [isOpen, sessionId, fetchMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const ensureSession = async (): Promise<string | null> => {
    if (sessionId) return sessionId
    setIsStarting(true)
    try {
      const res = await fetch("/api/chat/start", { method: "POST" })
      const data = await res.json()
      if (!res.ok || !data.sessionId) return null
      localStorage.setItem(SESSION_KEY, data.sessionId)
      setSessionId(data.sessionId)
      return data.sessionId
    } catch {
      return null
    } finally {
      setIsStarting(false)
    }
  }

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text || isSending) return
    setInputText("")
    setIsSending(true)

    const sid = await ensureSession()
    if (!sid) { setIsSending(false); return }

    const optimistic: Message = {
      _key: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    try {
      await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, text }),
      })
      await fetchMessages(sid)
    } catch { /* silent */ }

    setIsSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <Box position="fixed" bottom={6} right={6} zIndex={1000}>
      {isOpen && (
        <Box
          position="absolute"
          bottom="72px"
          right={0}
          w={{ base: "calc(100vw - 48px)", sm: "360px" }}
          maxH="480px"
          display="flex"
          flexDirection="column"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 8px 32px rgba(0,0,0,0.18)"
          border="1px solid"
          borderColor="border.default"
          bg="white"
        >
          {/* Header */}
          <HStack
            px={4}
            py={3}
            bg="accent.default"
            justify="space-between"
            flexShrink={0}
          >
            <VStack align="start" gap={0}>
              <Text color="white" fontWeight="700" fontSize="sm">Підтримка</Text>
              <Text color="whiteAlpha.800" fontSize="xs">Зазвичай відповідаємо за кілька хвилин</Text>
            </VStack>
            <IconButton
              aria-label="Закрити чат"
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => setIsOpen(false)}
            />
          </HStack>

          {/* Messages */}
          <Box flex="1" overflowY="auto" px={4} py={3} bg="gray.50">
            {messages.length === 0 && !isStarting && (
              <Box textAlign="center" py={8}>
                <Text fontSize="sm" color="gray.400">Напишіть повідомлення, щоб розпочати чат</Text>
              </Box>
            )}
            <VStack align="stretch" gap={2}>
              {messages.map((msg) => (
                <Box
                  key={msg._key}
                  display="flex"
                  justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
                >
                  <Box
                    maxW="75%"
                    px={3}
                    py={2}
                    borderRadius={msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px"}
                    bg={msg.role === "user" ? "accent.default" : "white"}
                    color={msg.role === "user" ? "white" : "text.default"}
                    boxShadow="sm"
                    fontSize="sm"
                  >
                    {msg.text}
                  </Box>
                </Box>
              ))}
            </VStack>
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <HStack px={3} py={3} borderTop="1px solid" borderColor="border.default" bg="white" flexShrink={0} gap={2}>
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишіть повідомлення..."
              size="sm"
              borderRadius="full"
              borderColor="border.default"
              _focus={{ borderColor: "accent.default", boxShadow: "none" }}
              flex={1}
              isDisabled={isSending || isStarting}
            />
            <IconButton
              aria-label="Надіслати"
              icon={isSending || isStarting ? <Spinner size="xs" /> : <FaPaperPlane />}
              size="sm"
              borderRadius="full"
              bg="accent.default"
              color="white"
              _hover={{ bg: "accent.hover" }}
              onClick={handleSend}
              isDisabled={!inputText.trim() || isSending || isStarting}
            />
          </HStack>
        </Box>
      )}

      {/* Toggle button */}
      <Box
        as="button"
        onClick={() => setIsOpen((v) => !v)}
        w="56px"
        h="56px"
        borderRadius="full"
        bg="accent.default"
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="0 4px 16px rgba(0,0,0,0.2)"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ bg: "accent.hover", transform: "scale(1.05)" }}
        aria-label={isOpen ? "Закрити чат" : "Відкрити чат"}
      >
        {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={22} />}
      </Box>
    </Box>
  )
}
