"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2, Share2 } from "lucide-react"
import Link from "next/link"

// Mock data - Replace with actual data from MongoDB
const mockChats = [
  {
    id: "1",
    title: "Discussión sobre Planificación",
    preview: "Hablemos sobre la línea de tiempo del proyecto y los entregables...",
    lastUpdated: "hace 2 horas",
    messageCount: 12,
  },
  {
    id: "2",
    title: "Consejos de Rendimiento en React",
    preview: "¿Cuáles son las mejores prácticas para optimizar aplicaciones React?",
    lastUpdated: "hace 1 día",
    messageCount: 8,
  },
  {
    id: "3",
    title: "Revisión del Sistema de Diseño",
    preview: "Revisando los nuevos componentes del sistema de diseño y directrices...",
    lastUpdated: "hace 3 días",
    messageCount: 24,
  },
  {
    id: "4",
    title: "Estrategia de Integración de IA",
    preview: "Planificando la integración de IA en nuestra plataforma existente...",
    lastUpdated: "hace 1 semana",
    messageCount: 15,
  },
]

export function ChatGrid() {
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
  }

  if (mockChats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Sin chats aún</h3>
        <p className="text-muted-foreground mb-6">Crea tu primer chat para comenzar</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {mockChats.map((chat) => (
        <Link key={chat.id} href={`/chat/${chat.id}`}>
          <Card className="group hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col p-5 bg-white">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {chat.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{chat.lastUpdated}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleShare(chat.id, e)}
                  className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => handleDelete(chat.id, e)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{chat.preview}</p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border">
              <MessageSquare className="w-4 h-4" />
              <span>{chat.messageCount} mensajes</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
