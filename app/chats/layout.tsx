import type React from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { AppHeader } from "@/components/app-header"
import PlussBanner from "@/components/pluss-banner"

export default function ChatsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id?: string }>
}) {
  return (
    <div className="flex flex-col h-screen">
      <AppHeader showUserMenu={true} />
      <PlussBanner />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        {children}
      </div>
    </div>
  )
}
