"use client"

import type React from "react"

import { useState } from "react"
import { Send, Paperclip } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    try {
      await onSendMessage(message)
      setMessage("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="max-w-4xl mx-auto flex gap-3">
        <button type="button" className="p-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/50">
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={disabled || isLoading}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar
        </button>
      </div>
    </form>
  )
}
