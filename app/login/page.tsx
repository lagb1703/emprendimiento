import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader showUserMenu={false} />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <LoginForm />
      </main>

      <AppFooter />
    </div>
  )
}
