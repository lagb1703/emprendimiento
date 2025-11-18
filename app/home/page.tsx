import { SearchChats } from "@/components/search-chats"
import { ChatGrid } from "@/components/chat-grid"
import { CreateChatButton } from "@/components/create-chat-button"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showUserMenu={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 px-6">
          {/* Quick Actions */}
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <SearchChats className="max-w-xs" />
            <CreateChatButton variant="primary" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Mis chats</h3>
            <p className="text-muted-foreground">Continúa con un chat existente o crea uno nuevo</p>
          </div>

          <ChatGrid />
        </div>
      </main>

      <AppFooter />

      {/* Mobile floating button */}
      <div className="md:hidden fixed bottom-6 right-6">
        <CreateChatButton variant="fab" />
      </div>
    </div>
  )
}
