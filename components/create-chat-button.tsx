"use client"

import { Button } from "@/components/ui/button"
import { Plus, MessageCircle } from "lucide-react"

interface CreateChatButtonProps {
  variant?: "primary" | "sidebar" | "fab"
}

export function CreateChatButton({ variant = "primary" }: CreateChatButtonProps) {
  const handleCreateChat = () => {
    // TODO: Navigate to new chat or open create dialog
    console.log("Create new chat")
  }

  if (variant === "sidebar") {
    return (
      <Button onClick={handleCreateChat} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <Plus className="w-4 h-4 mr-2" />
        Nuevo chat
      </Button>
    )
  }

  if (variant === "fab") {
    return (
      <Button
        onClick={handleCreateChat}
        size="lg"
        className="w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Button onClick={handleCreateChat} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Plus className="w-4 h-4 mr-2" />
      Nuevo chat
    </Button>
  )
}
