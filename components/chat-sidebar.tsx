"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Plus, Search, Trash2, MessageSquare } from "lucide-react"
import type { Chat } from "@/lib/db"

export function ChatSidebar({
  currentChatId,
  overlay = false,
  overrideWidth,
}: {
  currentChatId?: string
  overlay?: boolean
  overrideWidth?: number
}) {
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Estado y refs para redimensionamiento
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === "undefined") return 256
    try {
      const stored = localStorage.getItem("chatSidebarWidth")
      return stored ? Number(stored) : 256
    } catch (e) {
      return 256
    }
  })

  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const mouseMoveRef = useRef<(e: MouseEvent) => void | null>(null)
  const touchMoveRef = useRef<(e: TouchEvent) => void | null>(null)
  const mouseUpRef = useRef<() => void | null>(null)
  const MIN_WIDTH = 220
  const MAX_WIDTH = 520

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chats", {
          headers: { "x-user-id": "test-user" },
        })
        const data = await response.json()
        if (data.success) {
          setChats(data.data)
        }
      } catch (error) {
        console.error("[v0] Error fetching chats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  // Persistir ancho cuando cambie (no durante el arrastre)
  useEffect(() => {
    if (overlay) return
    if (!isDraggingRef.current) {
      try {
        localStorage.setItem("chatSidebarWidth", String(width))
      } catch (e) {
        /* ignore */
      }
    }
  }, [width, overlay])

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
        headers: { "x-user-id": "test-user" },
      })
      setChats(chats.filter((c) => c.id !== chatId))
    } catch (error) {
      console.error("[v0] Error deleting chat:", error)
    }
  }

  // Funciones para iniciar / detener arrastre
  const onPointerMove = (clientX: number) => {
    if (!isDraggingRef.current) return
    const delta = clientX - startXRef.current
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta))
    setWidth(newWidth)
  }

  const stopDragging = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    if (mouseMoveRef.current) window.removeEventListener("mousemove", mouseMoveRef.current)
    if (mouseUpRef.current) window.removeEventListener("mouseup", mouseUpRef.current)
    if (touchMoveRef.current) window.removeEventListener("touchmove", touchMoveRef.current)
    window.removeEventListener("touchend", stopDragging)

    try {
      localStorage.setItem("chatSidebarWidth", String(width))
    } catch (e) {
      /* ignore */
    }
  }

  const startDraggingMouse = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = width

    const mm = (ev: MouseEvent) => onPointerMove(ev.clientX)
    const mu = () => stopDragging()

    mouseMoveRef.current = mm
    mouseUpRef.current = mu

    window.addEventListener("mousemove", mm)
    window.addEventListener("mouseup", mu)
  }

  const startDraggingTouch = (e: React.TouchEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.touches[0].clientX
    startWidthRef.current = width

    const tm = (ev: TouchEvent) => onPointerMove(ev.touches[0].clientX)
    touchMoveRef.current = tm

    window.addEventListener("touchmove", tm)
    window.addEventListener("touchend", stopDragging)
  }

  const appliedWidth = overlay ? overrideWidth ?? width : width

  return (
    <aside
      ref={sidebarRef}
      style={{ width: appliedWidth }}
      className="bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0 relative"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Link
          href="/chats"
          className="flex items-center gap-2 w-full px-4 py-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Nuevo chat
        </Link>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/50" />
          <input
            type="text"
            placeholder="Buscar chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-sidebar-accent/10 border border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {loading ? (
            <div className="text-center py-8 text-sidebar-foreground/50">Cargando chats...</div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-8 text-sidebar-foreground/50">No hay chats</div>
          ) : (
            filteredChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chats/${chat.id}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  currentChatId === chat.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent/20 text-sidebar-foreground"
                }`}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate text-sm">{chat.title}</span>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-sidebar-accent/10">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Usuario</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">test-user</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
