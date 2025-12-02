"use client"

import React, { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { AppHeader } from "@/components/app-header"
import PlussBanner from "@/components/pluss-banner"

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarWidth, setMobileSidebarWidth] = useState<number>(320)

  useEffect(() => {
    const calculate = () => setMobileSidebarWidth(Math.min(window.innerWidth * 0.85, 360))
    calculate()
    window.addEventListener("resize", calculate)
    return () => window.removeEventListener("resize", calculate)
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <AppHeader showUserMenu={true} />
      <PlussBanner />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar visible on md+, hidden on small screens */}
        <div className="hidden md:block">
          <ChatSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">{children}</div>

        {/* Mobile: toggle button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed left-4 top-20 z-50 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground shadow"
          aria-label="Abrir chats"
        >
          Chats
        </button>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div
              className="absolute left-0 top-0 bottom-0 bg-background shadow-lg"
              style={{ width: mobileSidebarWidth }}
            >
              <ChatSidebar overlay overrideWidth={mobileSidebarWidth} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
