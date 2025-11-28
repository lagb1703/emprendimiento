import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { aboutContent } from "@/lib/content/about"

export default function AboutPage() {
  const content = aboutContent

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showUserMenu={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {content.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.hero.description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Mission Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">{content.mission.title}</h2>
            {content.mission.description.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>

          {/* Vision Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">{content.vision.title}</h2>
            {content.vision.description.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>

          {/* Values Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">{content.values.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {content.values.cards.map((value, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">{content.team.title}</h2>
            {content.team.description.map((paragraph, index) => (
              <p key={index} className="text-lg text-muted-foreground leading-relaxed mb-8">
                {paragraph}
              </p>
            ))}
            
            <div className="text-center">
              <p className="text-muted-foreground">
                {content.team.placeholder}
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-primary/5 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">{content.contact.title}</h2>
            <p className="text-muted-foreground mb-6">
              {content.contact.description}
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              {content.contact.button.text}
            </button>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}