"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchChatsProps {
  className?: string
}

export function SearchChats({ className }: SearchChatsProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input placeholder="Search chats..." className="pl-10 bg-background border-border" />
    </div>
  )
}
