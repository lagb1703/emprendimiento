"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/lib/db"
import { ChatMessage } from "./chat-message"

interface ChatContainerProps {
  messages: Message[]
  isLoading?: boolean
  streamingText?: string
}

export function ChatContainer({ messages, isLoading, streamingText }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages, streamingText])

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && !isLoading && !streamingText && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Inicia una conversación</h2>
            <p className="text-foreground/50 max-w-md">
              Haz una pregunta o comparte un tema y comenzaremos a conversar
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {streamingText && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-sm">AI</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 rounded-bl-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-card-foreground">
                {streamingText}
                <span className="inline-block w-2 h-5 ml-1 bg-foreground/50 animate-pulse rounded" />
              </p>
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-sm">AI</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse delay-100" />
                <div className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
