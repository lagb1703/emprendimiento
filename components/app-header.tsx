"use client"

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
          <div className="flex items-center justify-center">
            <img src="/tinyLogoWhite.png" alt="Logo" className="h-7" />
          </div>
          <h1 className="text-2xl font-bold">ChatHub</h1>
        </Link>

        <div className="flex items-center gap-4">
          {showUserMenu ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/signup" className="px-4 py-2 rounded-lg text-primary font-medium bg-white hover:bg-white/90 transition-colors">
                Registrarse
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-lg text-white font-medium bg-accent hover:bg-accent/90 transition-colors">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
