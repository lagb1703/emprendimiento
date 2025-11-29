import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  featured?: boolean
}

export function ServiceCard({ icon: Icon, title, description, featured = false }: ServiceCardProps) {
  return (
    <Card
      className={`flex flex-col items-center gap-4 p-6 text-center ${featured ? "bg-primary text-white" : "bg-white"}`}
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          featured ? "bg-white/20" : "bg-primary/10"
        }`}
      >
        <Icon className={`h-8 w-8 ${featured ? "text-white" : "text-primary"}`} />
      </div>
      <h3 className={`text-lg font-semibold ${featured ? "text-white" : "text-foreground"}`}>{title}</h3>
      <p className={`text-sm ${featured ? "text-white/90" : "text-muted-foreground"}`}>{description}</p>
    </Card>
  )
}
