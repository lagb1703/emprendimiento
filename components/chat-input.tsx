"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, Paperclip } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { File } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !selectedFile) || isLoading) return

    setIsLoading(true)
    try {
      if (selectedFile) {
        await onSendMessage(message, selectedFile)
      } else {
        await onSendMessage(message)
      }
      setMessage("")
      // limpiar archivo seleccionado
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("[v0] Error sending message or uploading file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileOptionClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // El menú lo maneja Radix (shadcn) internamente

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="max-w-4xl mx-auto flex gap-3 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/50">
              <Paperclip className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={6} className="w-44">
            <DropdownMenuItem onClick={handleFileOptionClick}>
              <File className="w-4 h-4 mr-2" />
              Subir archivo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

        {selectedFile && (
          <div className="flex items-center gap-2 px-2 py-1 bg-muted rounded-md border border-border">
            <span className="text-sm text-foreground/90 truncate max-w-[12rem]">{selectedFile.name}</span>
            <button type="button" onClick={removeSelectedFile} className="text-foreground/60 hover:text-foreground">
              ×
            </button>
          </div>
        )}

        <input
          type="text"
          id="text-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={disabled || isLoading}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={( !message.trim() && !selectedFile ) || isLoading || disabled}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar
        </button>
      </div>
    </form>
  )
}
