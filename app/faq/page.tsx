import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ChevronDown } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showUserMenu={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to the most common questions about GoodHealth
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-6">
            
            {/* General Questions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8">General Questions</h2>
              
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      What is GoodHealth?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      GoodHealth is an AI-powered healthcare platform that provides intelligent 
                      health consultations, personalized care recommendations, and seamless 
                      communication between patients and healthcare providers.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 2 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      How does the AI chat system work?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      Our AI chat system uses advanced natural language processing to understand 
                      your health concerns and provide relevant information. It can help with 
                      symptom assessment, health education, and connecting you with appropriate 
                      healthcare resources.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 3 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      Is my health data secure?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      Yes, we take data security very seriously. All health information is 
                      encrypted and stored securely according to healthcare data protection 
                      standards. We never share your personal health information without 
                      your explicit consent.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            {/* Account & Billing */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8">Account & Billing</h2>
              
              <div className="space-y-4">
                {/* FAQ Item 4 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      How do I create an account?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      You can create an account by clicking the "Registrarse" button in the 
                      header and filling out the registration form with your basic information. 
                      You'll receive a verification email to activate your account.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 5 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      What are the pricing plans?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      We offer flexible pricing plans to suit different needs. Please visit 
                      our pricing page or contact our support team for detailed information 
                      about our current plans and features.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 6 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      Can I cancel my subscription anytime?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      Yes, you can cancel your subscription at any time from your account 
                      settings. Your access will continue until the end of your current 
                      billing period.
                    </p>
                  </div>
                </details>
              </div>
            </section>

            {/* Technical Support */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-8">Technical Support</h2>
              
              <div className="space-y-4">
                {/* FAQ Item 7 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      What browsers are supported?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      GoodHealth works best on modern browsers including Chrome, Firefox, 
                      Safari, and Edge. We recommend keeping your browser updated to the 
                      latest version for optimal performance.
                    </p>
                  </div>
                </details>

                {/* FAQ Item 8 */}
                <details className="group bg-card border rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-accent/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground">
                      Is there a mobile app available?
                    </h3>
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground">
                    <p>
                      Currently, GoodHealth is available as a web application that works 
                      seamlessly on mobile browsers. We are working on dedicated mobile 
                      apps for iOS and Android, which will be available soon.
                    </p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          {/* Contact Support Section */}
          <div className="bg-primary/5 p-8 rounded-lg text-center mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors">
                Submit a Ticket
              </button>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}