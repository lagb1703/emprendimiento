"use client"

import { useCallback, useState, useRef } from "react"
import type { Message } from "@/lib/db"

interface StreamingMessage {
  id: string
  chat_id: string
  user_id: string
  content: string
  role: "user" | "assistant"
  created_at: string
}

export function useChat(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!chatId || !content.trim()) return

      setIsLoading(true)
      setStreamingText("")
      abortControllerRef.current = new AbortController()

      try {
        // Step 1: Save user message first
        const userMsgRes = await fetch(`/api/chats/${chatId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "test-user",
          },
          body: JSON.stringify({
            content,
            role: "user",
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!userMsgRes.ok) throw new Error("Failed to save user message")

        const userMsgData = await userMsgRes.json()
        if (userMsgData.success) {
          setMessages((prev) => [...prev, userMsgData.data])
        }

        // Step 2: Get AI response with streaming
        const aiRes = await fetch(`/api/chats/${chatId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "test-user",
          },
          body: JSON.stringify({
            content: "", // Empty - we'll collect from stream
            role: "assistant",
            isStreaming: true,
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!aiRes.ok) throw new Error("Failed to get AI response")

        let fullText = ""

        // Step 3: Handle streaming response
        if (aiRes.body) {
          const reader = aiRes.body.getReader()
          const decoder = new TextDecoder()

          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) break

              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split("\n")

              for (const line of lines) {
                if (line.startsWith("data:")) {
                  try {
                    const data = JSON.parse(line.slice(5))
                    if (data.type === "text-delta" && data.delta) {
                      fullText += data.delta
                      setStreamingText(fullText)
                    }
                  } catch {
                    // Ignore parsing errors for non-JSON lines
                  }
                }
              }
            }
          } finally {
            reader.releaseLock()
          }
        }

        // Step 4: Save complete AI message
        if (fullText) {
          const aiMsgRes = await fetch(`/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": "test-user",
            },
            body: JSON.stringify({
              content: fullText,
              role: "assistant",
            }),
            signal: abortControllerRef.current.signal,
          })

          if (aiMsgRes.ok) {
            const aiMsgData = await aiMsgRes.json()
            if (aiMsgData.success) {
              setMessages((prev) => [...prev, aiMsgData.data])
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("[v0] Error in useChat:", error)
        }
      } finally {
        setIsLoading(false)
        setStreamingText("")
      }
    },
    [chatId],
  )

  return { messages, isLoading, streamingText, sendMessage }
}
