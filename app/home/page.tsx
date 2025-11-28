import React from "react"
import { CreateChatButton } from "@/components/create-chat-button"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { HeroSection } from "@/components/hero-section"
import { ServiceCard } from "@/components/service-card"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Users, Wrench, Languages, Smile, Stethoscope, Calendar, User, Mail, Phone, Home } from "lucide-react"
import Link from "next/link"
import { homeContent } from "@/lib/content/home"

// Icon mapping helper
const iconMap = {
  Bot,
  Users,
  Wrench,
  Languages,
  Smile,
  Stethoscope,
  Calendar,
  User,
  Mail,
  Phone,
  Home,
}

export default function HomePage() {
  // Add error handling for content loading
  let content
  try {
    content = homeContent
  } catch (error) {
    console.error('Error loading home content:', error)
    // Fallback content structure
    content = {
      problem: { description: [], badge: '', title: '', link: { text: '', href: '' }, image: { src: '', alt: '' } },
      services: { badge: '', title: '', cards: [] },
      stats: { cards: [] },
      appointment: { badge: '', title: '', form: { name: { label: '', placeholder: '' }, email: { label: '', placeholder: '' }, phone: { label: '', placeholder: '' }, service: { label: '', placeholder: '' }, submit: '' }, brand: { name: '', image: { src: '', alt: '' } } },
      solution: { description: [], badge: '', title: '', link: { text: '', href: '' }, image: { src: '', alt: '' } },
      newsletter: { title: '', description: '', form: { placeholder: '', button: '' } }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showUserMenu={false} />
      <HeroSection />

      {/* Problem Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/10">
                <img
                  src={content.problem.image.src || "/placeholder.svg"}
                  alt={content.problem.image.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                {content.problem.badge}
              </p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">{content.problem.title}</h2>
              {content.problem.description.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {paragraph}
                </p>
              ))}
              <Link
                href={content.problem.link.href}
                className="inline-flex items-center gap-2 text-base font-semibold text-secondary hover:underline sm:text-lg min-h-[44px]"
              >
                {content.problem.link.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary sm:mb-4 sm:text-sm">
              {content.services.badge}
            </p>
            <h2 className="mx-auto max-w-4xl text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              {content.services.title}
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {content.services.cards.map((service, index) => (
              <ServiceCard
                key={index}
                icon={iconMap[service.icon as keyof typeof iconMap]}
                title={service.title}
                description={service.description}
                featured={service.featured}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="bg-primary px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {content.stats.cards.map((stat, index) => {
              const Icon = iconMap[stat.icon as keyof typeof iconMap]
              return (
                <div key={index} className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
                  <StatCard
                    icon={<Icon className="h-6 w-6 sm:h-8 sm:w-8" />}
                    title={stat.title}
                    value={stat.value}
                    subtitle={stat.subtitle}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* Solution Section */}
      <section className="bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            
            <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                {content.solution.badge}
              </p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">{content.solution.title}</h2>
              {content.solution.description.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {paragraph}
                </p>
              ))}
              <Link
                href={content.solution.link.href}
                className="inline-flex items-center gap-2 text-base font-semibold text-secondary hover:underline sm:text-lg min-h-[44px]"
              >
                {content.solution.link.text}
              </Link>
            </div>

            <div className="order-2 lg:order-2">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/10">
                <img
                  src={content.solution.image.src || "/placeholder.svg"}
                  alt={content.solution.image.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <AppFooter />

      {/* Mobile floating button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden sm:bottom-6 sm:right-6">
        <CreateChatButton variant="fab" />
      </div>
    </div>
  )
}
