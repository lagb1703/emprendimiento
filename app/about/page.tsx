import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showUserMenu={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About GoodHealth
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering healthcare through innovative AI-powered solutions
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Mission Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At GoodHealth, we are committed to revolutionizing healthcare accessibility 
              through cutting-edge artificial intelligence. Our platform provides intelligent 
              health consultations, personalized care recommendations, and seamless 
              communication between patients and healthcare providers.
            </p>
          </section>

          {/* Vision Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We envision a world where quality healthcare is accessible to everyone, 
              regardless of location or economic status. Through our AI-powered platform, 
              we aim to bridge the gap between patients and healthcare professionals, 
              making health consultations more efficient, affordable, and personalized.
            </p>
          </section>

          {/* Values Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of technology to create 
                  groundbreaking solutions in healthcare.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Healthcare should be available to everyone, and we work to 
                  eliminate barriers to quality medical care.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-3">Privacy</h3>
                <p className="text-muted-foreground">
                  We prioritize the security and confidentiality of all patient 
                  data with the highest standards of protection.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-foreground mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in every aspect of our service, 
                  ensuring the best possible outcomes for our users.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Team</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              GoodHealth is built by a dedicated team of healthcare professionals, 
              AI researchers, and software engineers who are passionate about 
              improving global health outcomes through technology.
            </p>
            
            <div className="text-center">
              <p className="text-muted-foreground">
                More team information coming soon...
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-primary/5 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions about GoodHealth? We'd love to hear from you.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Contact Us
            </button>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}