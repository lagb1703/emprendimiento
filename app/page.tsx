import { SearchChats } from "@/components/search-chats"
import { ChatGrid } from "@/components/chat-grid"
import { CreateChatButton } from "@/components/create-chat-button"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { Brain } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showUserMenu={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 px-6">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">ChatHub</h2>
            <p className="text-xl text-muted-foreground mb-2">
              <span className="text-accent font-semibold">Inteligencia Artificial</span>
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accede a múltiples chats de IA potenciados por las últimas tecnologías de inteligencia artificial
            </p>
          </div>
        </div>

        {/* Main Content */}
      </main>

      <AppFooter />

      {/* Mobile floating button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <CreateChatButton variant="fab" />
      </div>
    </div>
  )
}
