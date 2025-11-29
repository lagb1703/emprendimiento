import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ChevronDown } from "lucide-react"
import { faqContent } from "@/lib/content/faq"

export default function FAQPage() {
  const content = faqContent

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

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-6">
            {content.categories.map((category, categoryIndex) => (
              <section key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-8">{category.title}</h2>
                
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <details key={faqIndex} className="group bg-card border rounded-lg">
                      <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                        <h3 className="text-lg font-semibold text-foreground">
                          {faq.question}
                        </h3>
                        <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-6 pb-6 text-muted-foreground">
                        <p>
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Support Section */}
          {/* <div className="bg-primary/5 p-8 rounded-lg text-center mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {content.support.title}
            </h2>
            <p className="text-muted-foreground mb-6">
              {content.support.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {content.support.buttons.map((button, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    button.type === 'primary'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-primary text-primary hover:bg-primary/5'
                  }`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          </div>
           */}
        </div>
      </main>

      <AppFooter />
    </div>
  )
}