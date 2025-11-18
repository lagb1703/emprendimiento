import { CreateChatButton } from "@/components/create-chat-button"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <AppHeader showUserMenu={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-1 pt-6">
            <div className="inline-flex items-center justify-center w-[15vw] h-[15vw] relative">
              <Image src="/tinyLogoBlue.png" alt="Logo" fill className="object-contain" />
            </div>
            <p className="text-[5vw] text-muted-foreground mb-2 font-black leading-[0.85]">
              <span className="block text-[#016FD8]">GOOD</span>
              <span className="block text-[#00D8B5] mt-1">HEALTH</span>
            </p>
          </div>
          <div className="w-full flex justify-center">
            <div className="w-fit flex justify-center p-4 space-x-2 bg-[#f6f6f6] rounded-full">
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="secondary">Secondary</Badge>
            </div>
          </div>
          <div className="max-w-7xl mx-auto text-center mb-1 pt-6">
            <div className="inline-flex items-center justify-center w-[60vw] h-[15vw] relative">
              <Image src="/image.png" alt="Logo" fill className="object-contain" />
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
