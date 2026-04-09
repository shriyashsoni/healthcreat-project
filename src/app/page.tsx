import Link from "next/link";
import { ArrowRight, Activity, ShieldCheck, Clock, Users, Globe, Brain } from "lucide-react";
import AuthButton from "@/components/AuthButton";

export default function LandingPage() {
  return (
    <div className="font-sans bg-bg-primary text-text-primary min-h-screen selection:bg-accent-blue selection:text-white">
      {/* 1. STICKY NAV */}
      <nav className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-border-light border-opacity-50 transition-all">
        <div className="flex items-center gap-2">
          {/* Logo representation */}
          <div className="w-6 h-6 rounded-sm bg-text-primary"></div>
          <span className="font-bold tracking-tight text-lg">HealthRouter</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-text-secondary text-sm font-medium">
          <Link href="#how-it-works" className="hover:text-text-primary transition-colors">How it works</Link>
          <Link href="#impact" className="hover:text-text-primary transition-colors">Impact</Link>
          <Link href="#technology" className="hover:text-text-primary transition-colors">Technology</Link>
        </div>

        <div className="flex items-center gap-4">
          <AuthButton />
          <Link
            href="/chat"
            className="bg-text-primary text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all inline-block"
          >
            Check Your Symptoms
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="px-6 py-24 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-8 items-start">
        <div className="w-full md:w-[60%]">
          <h1 className="text-[3rem] md:text-[5rem] font-black leading-[1.05] tracking-[-0.02em] text-text-primary">
            Find the right <span className="relative">
              specialist<span className="absolute bottom-1 left-0 w-full h-[6px] bg-accent-blue/30 rounded-full"></span>
            </span>, without the guesswork.
          </h1>
        </div>
        <div className="w-full md:w-[40%] flex flex-col gap-8 md:pt-4">
          <p className="text-lg text-text-secondary leading-[1.6]">
            Every day, millions self-medicate or visit the wrong doctor simply because they don't know where to start. We use safe, conversational AI to guide you to the right care—in your language, at no cost.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="bg-text-primary text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Start Free Triage <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs uppercase tracking-widest text-text-secondary font-medium">
              No diagnosis.<br/>Just guidance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. DARK BAND (VISUAL / MOCKUP) */}
      <section className="bg-bg-secondary w-full py-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          {/* Geometric Abstract Representation of the product instead of a photo */}
          <div className="flex gap-4 md:gap-8 opacity-80 mix-blend-screen overflow-hidden whitespace-nowrap">
            <div className="w-32 h-64 rounded-full border border-border-dark flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-accent-blue/20 to-transparent"></div>
              <Activity className="w-12 h-12 text-border-light" />
            </div>
            <div className="w-64 h-64 rounded-full border border-border-dark flex items-center justify-center overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-accent-green/20 to-transparent"></div>
               <Brain className="w-12 h-12 text-border-light" />
            </div>
            <div className="w-32 h-64 rounded-full border border-border-dark flex items-center justify-center overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/20 to-transparent"></div>
               <Globe className="w-12 h-12 text-border-light" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-24 max-w-7xl mx-auto border-b border-border-light">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.1em] text-text-secondary font-medium mb-4">The Process</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary max-w-2xl">
            Clarity in three simple steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            {
              id: "01",
              title: "Describe your symptoms",
              desc: "Speak naturally in English, Hindi, Tamil, or Telugu. Tell our assistant what's bothering you, just like you would to a friend."
            },
            {
              id: "02",
              title: "Answer brief questions",
              desc: "Our AI asks 3–4 targeted follow-up questions to understand the severity, duration, and your basic medical history."
            },
            {
              id: "03",
              title: "Get simple, safe guidance",
              desc: "Receive a clear recommendation on which specialist to see, suggested baseline tests to carry along, and red flags to avoid."
            }
          ].map((step) => (
            <div key={step.id} className="flex flex-col gap-4">
              <div className="text-sm font-bold text-accent-blue border-b border-border-light pb-4 mb-2">{step.id}</div>
              <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STATS / IMPACT GRID */}
      <section id="impact" className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.1em] text-text-secondary font-medium mb-12 text-center md:text-left">Community Impact</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="flex flex-col gap-2">
              <Activity className="w-8 h-8 text-accent-green mb-4" />
              <div className="text-5xl md:text-7xl font-black text-text-primary tracking-tight">60%</div>
              <p className="text-text-secondary font-medium mt-2">Reduction in unguided specialist visits</p>
            </div>
            <div className="flex flex-col gap-2">
              <Clock className="w-8 h-8 text-accent-blue mb-4" />
              <div className="text-5xl md:text-7xl font-black text-text-primary tracking-tight">2 min</div>
              <p className="text-text-secondary font-medium mt-2">Average time to get a clear routing recommendation</p>
            </div>
            <div className="flex flex-col gap-2">
              <Users className="w-8 h-8 text-[#E25A36] mb-4" />
              <div className="text-5xl md:text-7xl font-black text-text-primary tracking-tight">10+</div>
              <p className="text-text-secondary font-medium mt-2">Languages seamlessly supported via LLaMA 3.1</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES CARDS */}
      <section id="technology" className="px-6 py-24 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-16 max-w-2xl">
            Built for safety and accessibility.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-card rounded-[20px] p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <ShieldCheck className="w-8 h-8 text-text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">Zero Diagnostic Risk</h3>
                <p className="text-text-secondary leading-relaxed">
                  We explicitly never diagnose. Our system functions purely as a smart router, eliminating regulatory hurdles while providing immense consumer value.
                </p>
              </div>
              <div className="mt-8 border-t border-border-light pt-4 flex justify-between items-center text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                <span>Category</span>
                <span>Safety First</span>
              </div>
            </div>

            <div className="bg-bg-card rounded-[20px] p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <Globe className="w-8 h-8 text-accent-blue mb-6" />
                <h3 className="text-xl font-bold mb-3">India-First Multilingual</h3>
                <p className="text-text-secondary leading-relaxed">
                  Powered by LLaMA 8B for fast, context-aware translation, capturing nuanced symptom descriptions in regional languages perfectly.
                </p>
              </div>
              <div className="mt-8 border-t border-border-light pt-4 flex justify-between items-center text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                <span>Model</span>
                <span>Llama 3.1 8B</span>
              </div>
            </div>

            <div className="bg-bg-card rounded-[20px] p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <Brain className="w-8 h-8 text-accent-green mb-6" />
                <h3 className="text-xl font-bold mb-3">Clinical Grade Reasoning</h3>
                <p className="text-text-secondary leading-relaxed">
                  Final routing decisions are verified by Nemotron-70B, ensuring the highest semantic reasoning quality before a specialist recommendation is made.
                </p>
              </div>
              <div className="mt-8 border-t border-border-light pt-4 flex justify-between items-center text-[11px] font-bold text-text-secondary uppercase tracking-widest">
                <span>Model</span>
                <span>Nemotron 70B</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="bg-bg-secondary text-white py-32 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
            Stop guessing.<br/>Start healing.
          </h2>
          <p className="text-[#888888] text-lg max-w-xl">
            Get trusted, instant guidance on your next medical step. Free for everyone, forever.
          </p>
          <div className="mt-4">
            <Link
              href="/chat"
              className="bg-white text-bg-secondary px-8 py-4 rounded-md font-bold text-lg hover:bg-gray-200 transition-colors inline-block"
            >
              Check Your Symptoms
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-bg-primary px-6 py-12 border-t border-border-light">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-text-secondary uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-text-secondary"></div>
            HealthRouter
          </div>
          <div className="text-center md:text-right">
            © 2026 HealthRouter. A consumer Healthcare Initiative.
            <div className="mt-2 text-[10px] opacity-70">powered by NVIDIA NIM</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
