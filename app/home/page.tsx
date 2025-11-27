import { CreateChatButton } from "@/components/create-chat-button"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ServiceCard } from "@/components/service-card"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
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
  Home
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showUserMenu={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muted/30 to-white px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="text-secondary">GOOD</span>
                <br />
                <span className="text-primary">HEALTH</span>
              </h1>
              <p className="mx-auto text-lg font-semibold text-foreground sm:text-xl md:text-2xl lg:mx-0">
                Bienestar mental en la palma de tu mano
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 min-h-[48px] px-8">
                  Registrarse
                </Button>
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 min-h-[48px] px-8">
                  Iniciar sesión
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96">
                {/* Outer blue ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 p-7 shadow-2xl">
                  {/* Inner green/teal ring */}
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-2">
                    {/* White center circle */}
                    <div className="flex h-full w-full items-center justify-center rounded-full">
                      {/* Brain icon container */}
                      <div className="flex h-full w-full items-center justify-center p-8">
                        <img src="/tinyLogoWhite.png" alt="ChatHub Logo" className="dark:block hidden" />
                        <img src="/tinyLogoWhite.png" alt="ChatHub Logo" className="dark:hidden" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/10">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Mental health illustration"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">Who we are?</p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">El problema</h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Millones de personas como Laura, una estudiante universitaria con poco tiempo y recursos, o Andrés, un
                empleado con jornadas laborales extensas que no se atreve a pedir ayuda, enfrentan cada día estrés,
                ansiedad y falta de apoyo emocional.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                El acceso a servicios de salud mental sigue siendo costoso, limitado y poco oportuno.
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-base font-semibold text-secondary hover:underline sm:text-lg min-h-[44px]"
              >
                Know more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary sm:mb-4 sm:text-sm">Nuestros servicios</p>
            <h2 className="mx-auto max-w-4xl text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              En GoodHealth combinamos lo mejor de la tecnología
              <span className="hidden sm:inline">
                <br />
              </span>
              <span className="sm:hidden"> </span>
              y la psicología para ofrecerte apoyo real
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <ServiceCard
              icon={Bot}
              title="Psicólogo virtual con IA"
              description="Entrenado en salud mental, disponible las 24 horas."
            />
            <ServiceCard
              icon={Users}
              title="Consultas con psicólogos profesionales"
              description="Encuentra a tu psicólogo ideal y accesibles."
              featured
            />
            <ServiceCard
              icon={Wrench}
              title="Herramientas de autoayuda"
              description="Recursos para tu salud mental siempre disponibles."
            />
            <ServiceCard icon={Languages} title="Múltiples idiomas" description="Para romper barreras." />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <StatCard 
              icon={<Smile className="h-6 w-6 sm:h-8 sm:w-8" />} 
              title="Happy Patients" 
              value="30,00,000+" 
              subtitle="Satisfied customers worldwide" 
            />
            <StatCard 
              icon={<Stethoscope className="h-6 w-6 sm:h-8 sm:w-8" />} 
              title="Experienced Doctors" 
              value="409+" 
              subtitle="Professional healthcare providers" 
            />
            <div className="sm:col-span-2 lg:col-span-1">
              <StatCard 
                icon={<Calendar className="h-6 w-6 sm:h-8 sm:w-8" />} 
                title="Years of Experience" 
                value="18+" 
                subtitle="Trusted healthcare service" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <Card className="order-2 p-6 sm:p-8 lg:order-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">Need consultation?</p>
              <h2 className="mb-6 text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">Book an appointment</h2>
              <form className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <User className="h-4 w-4" />
                      Name
                    </label>
                    <Input placeholder="Enter name here" className="min-h-[44px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <Input placeholder="Enter email here" type="email" className="min-h-[44px]" />
                  </div>
                </div>
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <Input placeholder="Enter phone no. here" type="tel" className="min-h-[44px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Home className="h-4 w-4" />
                      Service
                    </label>
                    <Input placeholder="Select service" className="min-h-[44px]" />
                  </div>
                </div>
                <Button className="w-full bg-primary text-white hover:bg-primary/90 min-h-[48px]" size="lg">
                  Submit
                </Button>
              </form>
            </Card>
            <div className="order-1 flex min-h-[300px] items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 p-8 text-center sm:min-h-[400px] sm:p-12 lg:order-2">
              <div className="space-y-4">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-white/20 sm:h-32 sm:w-32">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt="Medifine"
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">Medifine</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section 2 */}
      <section className="bg-muted/30 px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/10">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Mental health support"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">Our Solution</p>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">La solución</h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                GoodHealth democratiza el acceso a la salud mental combinando inteligencia artificial avanzada con 
                profesionales licenciados, ofreciendo apoyo inmediato, personalizado y accesible las 24 horas del día.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Nuestra plataforma reduce barreras económicas y geográficas, proporcionando herramientas efectivas 
                para el bienestar mental de todos.
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-base font-semibold text-secondary hover:underline sm:text-lg min-h-[44px]"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground sm:mb-4 sm:text-3xl">Get offers</h2>
          <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">Get all the latest offers and updates from us</p>
          <form className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Input 
              type="email" 
              placeholder="Enter email here" 
              className="flex-1 min-h-[44px] sm:min-h-[48px]" 
            />
            <Button className="bg-secondary text-white hover:bg-secondary/90 min-h-[44px] px-6 sm:min-h-[48px] sm:px-8">
              Subscribe
            </Button>
          </form>
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