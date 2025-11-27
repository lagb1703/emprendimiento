"use client"

import { UserMenu } from "./user-menu"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface AppHeaderProps {
  showUserMenu?: boolean
}

export function AppHeader({ showUserMenu = false }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-primary">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex items-center justify-center">
            <img src="/fullWhiteLogo.png" alt="ChatHub Logo" className="h-8 dark:block hidden" />
            <img src="/fullWhiteLogo.png" alt="ChatHub Logo" className="h-8 dark:hidden" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex text-primary-foreground">
          <Link
            href="/about"
            className="text-sm font-medium text-background transition-colors hover:text-secondary"
          >
            About Us
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-background transition-colors hover:text-secondary"
          >
            FAQ
          </Link>
        </nav>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="hidden items-center gap-3 md:flex">
          {showUserMenu ? (
            <UserMenu />
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:text-secondary"
              >
                Registrarse
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-primary-foreground px-4 py-2 text-sm font-medium text-foreground shadow transition-all hover:bg-secondary hover:shadow-md"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-accent md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            <Link
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/faq"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
              {showUserMenu ? (
                <div className="px-3">
                  <UserMenu />
                </div>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-lg px-4 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
