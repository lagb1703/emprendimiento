"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function UserMenu() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) {
        throw new Error('Error al cerrar sesión')
      }
      toast({ title: 'Sesión cerrada', description: 'Redirigiendo al login' })
      router.push('/login')
    } catch (err) {
      console.error(err)
      toast({ title: 'No se pudo cerrar sesión', description: 'Intenta de nuevo' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/10">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-white/20 text-primary-foreground font-semibold">U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleLogout} className={isLoading ? 'opacity-60 pointer-events-none' : ''}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
