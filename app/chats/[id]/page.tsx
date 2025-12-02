"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import type { Chat, Message } from "@/lib/db"
import { ChatContainer } from "@/components/chat-container"
import { ChatInput } from "@/components/chat-input"
import { useChat } from "@/hooks/use-chat"

export default function ChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const chatId = params.id as string

  const [chat, setChat] = useState<Chat | null>(null)
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const { messages: streamMessages, isLoading, streamingText, sendMessage } = useChat(chatId)

  const initialMessage = searchParams?.get("initialMessage") ?? null

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const [chatRes, messagesRes] = await Promise.all([
          fetch(`/api/chats/${chatId}`, {
            headers: { "x-user-id": "test-user" },
          }),
          fetch(`/api/chats/${chatId}/messages`, {
            headers: { "x-user-id": "test-user" },
          }),
        ])

        const chatData = await chatRes.json()
        const messagesData = await messagesRes.json()

        if (chatData.success) {
          setChat(chatData.data)
        }
        if (messagesData.success) {
          setAllMessages(messagesData.data)
        }
      } catch (error) {
        console.error("[v0] Error fetching chat:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    if (chatId && chatId !== "new") {
      fetchChat()
    } else {
      setIsInitialLoading(false)
    }
  }, [chatId])

  // If an initial message was passed via query param, send it once and remove the param
  useEffect(() => {
    const timer = setTimeout(() => {
      router.refresh()
    }, 3500);
    return () => clearTimeout(timer)
  }, [])

  // Combine stored messages with streaming messages
  const displayMessages = [...allMessages, ...streamMessages]

  if (chatId === "new") {
    return (
      <div className="flex-1 flex flex-col">
        <ChatContainer messages={[]} />
        <ChatInput onSendMessage={async () => {}} disabled={true} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ChatContainer messages={displayMessages} streamingText={streamingText} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} disabled={isInitialLoading} />
    </div>
  )
}
