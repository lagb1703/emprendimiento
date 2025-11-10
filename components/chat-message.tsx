"use client"

import { Brain } from "lucide-react"
import type { Message } from "@/lib/db"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
      )}

      <div
        className={`max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? "bg-accent text-accent-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none border border-border"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-50 mt-2 block">
          {new Date(message.created_at).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">
          U
        </div>
      )}
    </div>
  )
}
