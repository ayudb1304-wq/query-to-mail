import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { PainSection } from "@/components/landing/pain-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Pricing } from "@/components/landing/pricing"
import { FooterCta } from "@/components/landing/footer-cta"

export default function Page() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main>
        <Hero />
        <PainSection />
        <HowItWorks />
        <Pricing />
        <FooterCta />
      </main>
    </div>
  )
}
