"use client"

import { Brain } from "lucide-react"
import { UserMenu } from "./user-menu"
import Link from "next/link"

interface AppHeaderProps {
  showUserMenu?: boolean
}

export function AppHeader({ showUserMenu = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">ChatHub</h1>
        </Link>

        <div className="flex items-center gap-4">
          {showUserMenu ? (
            <UserMenu />
          ) : (
            <>
              <button className="px-4 py-2 rounded-lg text-primary font-medium bg-white hover:bg-white/90 transition-colors">
                Registrarse
              </button>
              <button className="px-4 py-2 rounded-lg text-white font-medium bg-accent hover:bg-accent/90 transition-colors">
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
