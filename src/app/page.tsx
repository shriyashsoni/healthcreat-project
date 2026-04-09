export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg">Aura Health</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm hover:text-primary transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-sm hover:text-primary transition-colors">
            Benefits
          </a>
          <a href="#pricing" className="text-sm hover:text-primary transition-colors">
            Pricing
          </a>
        </div>
        <button className="px-6 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 md:px-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-primary font-medium text-sm mb-4">Welcome to Aura Health</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-balance">
                Transform Your Wellness Journey
              </h1>
              <p className="text-lg text-secondary leading-relaxed mb-8 text-balance">
                Personalized health insights, mindfulness practices, and holistic wellness solutions designed to help you live your best life.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                Start Free Trial
              </button>
              <button className="px-8 py-3 rounded-full border-2 border-border font-medium hover:bg-muted transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 md:p-12 flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-full"></div>
              </div>
              <p className="text-secondary font-medium">Your wellness companion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 md:py-32 md:px-12 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Everything you need to take control of your health and wellness
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏃",
                title: "Activity Tracking",
                description: "Monitor your daily activities, workouts, and progress with intelligent insights."
              },
              {
                icon: "😴",
                title: "Sleep Optimization",
                description: "Track sleep patterns and receive personalized recommendations for better rest."
              },
              {
                icon: "🧘",
                title: "Mindfulness",
                description: "Access guided meditations and mindfulness exercises for mental wellness."
              },
              {
                icon: "🥗",
                title: "Nutrition Planning",
                description: "Personalized meal suggestions and nutrition tracking tailored to your goals."
              },
              {
                icon: "📊",
                title: "Health Analytics",
                description: "Detailed health metrics and analytics to understand your wellness trends."
              },
              {
                icon: "👥",
                title: "Community Support",
                description: "Connect with others on their wellness journey and share experiences."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="px-6 py-20 md:py-32 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-gradient-to-br from-accent/30 to-primary/20 rounded-3xl p-12 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block bg-primary/20 text-primary font-bold text-3xl w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  +92%
                </div>
                <p className="text-secondary">Users report improved wellness</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Aura?</h2>
              <ul className="space-y-4">
                {[
                  "Evidence-based wellness programs",
                  "Personalized AI recommendations",
                  "24/7 expert support available",
                  "Integrates with health devices",
                  "Privacy-first approach",
                  "Affordable pricing plans"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">✓</span>
                    </span>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:py-32 md:px-12 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Health?</h2>
          <p className="text-lg text-primary/90 mb-8 max-w-2xl mx-auto">
            Join thousands of people already using Aura Health to build better wellness habits.
          </p>
          <button className="px-8 py-3 rounded-full bg-white text-primary font-medium hover:bg-gray-100 transition-colors">
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-secondary">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-secondary">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-secondary">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-secondary">
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-secondary text-sm">© 2024 Aura Health. All rights reserved.</p>
            <p className="text-secondary text-sm mt-4 md:mt-0">Built with health and wellness in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
