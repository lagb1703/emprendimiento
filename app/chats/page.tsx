"use client"

import { useRouter } from "next/navigation"
import { ChatContainer } from "@/components/chat-container"
import { ChatInput } from "@/components/chat-input"
import { useChat } from "@/hooks/use-chat"
import { useState, useCallback, useEffect } from "react"

export default function ChatPage() {
  const [chatId, setChatId] = useState<string>("")
  const [messages, setMessages] = useState("")
  const router = useRouter()

  const { sendMessage } = useChat(chatId)

  const createAndOpenChat = useCallback(async (message: string) => {
    if (!message.trim()) return

    const title = message.trim().slice(0, 100)

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!res.ok) throw new Error("Failed to create chat")

      const data = await res.json()
      if (data.success && data.data?.id) {
        const chatId = data.data.id
        setChatId(chatId)
        setMessages(message);
      }
    } catch (error) {
      console.error("[v0] Error creating chat:", error)
    }
  }, [router, setChatId])

  useEffect(() => {
    if (chatId) {
      sendMessage(messages);
      const timer = setTimeout(() => {
        ;(async () => {
          try {
            router.push(`/chats/${chatId}`)
          } catch (e) {
            console.warn('[v0] router.push failed:', e)
          }
          try {
            router.refresh()
          } catch (e) {
            console.warn('[v0] router.refresh failed:', e)
          }
        })()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [chatId, sendMessage, messages])

  return (
    <div className="flex-1 flex flex-col">
      <ChatContainer messages={[]} streamingText={""} isLoading={false} />
      <ChatInput onSendMessage={createAndOpenChat} disabled={false} />
    </div>
  )
}
