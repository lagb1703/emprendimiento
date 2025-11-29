"use client"

import { useRouter } from "next/navigation"
import { ChatContainer } from "@/components/chat-container"
import { ChatInput } from "@/components/chat-input"

export default function ChatPage() {
  const router = useRouter()

  const createAndOpenChat = async (message: string) => {
    if (!message.trim()) return

    const title = message.trim().slice(0, 100)

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "test-user",
        },
        body: JSON.stringify({ title }),
      })

      if (!res.ok) throw new Error("Failed to create chat")

      const data = await res.json()
      if (data.success && data.data?.id) {
        const chatId = data.data.id
        // Navigate to the new chat and pass the initial message as a query param
        router.push(`/chats/${chatId}?initialMessage=${encodeURIComponent(message)}`)
      }
    } catch (error) {
      console.error("[v0] Error creating chat:", error)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatContainer messages={[]} streamingText={""} isLoading={false} />
      <ChatInput onSendMessage={createAndOpenChat} disabled={false} />
    </div>
  )
}
