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
            
            {/* Team Members Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {content.team.members.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/10"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>

      <AppFooter />
    </div>
  )
}