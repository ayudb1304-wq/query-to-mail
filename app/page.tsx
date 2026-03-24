import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { PainSection } from "@/components/landing/pain-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Pricing } from "@/components/landing/pricing"
import { EarlyAdopter } from "@/components/landing/early-adopter"
import { Faq } from "@/components/landing/faq"
import { FooterCta } from "@/components/landing/footer-cta"

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Query2Mail",
  url: "https://query2mail.com",
  logo: "https://query2mail.com/icon.png",
  description:
    "Automated SQL-to-Excel reporting. Run queries on a schedule, deliver formatted Excel files to any inbox.",
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Query2Mail",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "SQL report scheduler that runs database queries on a schedule and delivers formatted Excel reports via email. Supports PostgreSQL and MySQL.",
  url: "https://query2mail.com",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to start. Paid tiers coming soon.",
  },
  featureList: [
    "Scheduled SQL query execution",
    "Automated Excel report generation",
    "Email report delivery",
    "PostgreSQL and MySQL support",
    "No dashboard required for recipients",
  ],
}

export default function Page() {
  return (
    <div className="min-h-svh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Navbar />
      <main>
        <Hero />
        <PainSection />
        <HowItWorks />
        <Pricing />
        <EarlyAdopter />
        <Faq />
        <FooterCta />
      </main>
    </div>
  )
}
