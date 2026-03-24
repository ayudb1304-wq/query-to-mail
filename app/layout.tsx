import type { Metadata } from "next"
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { GA4 } from "@/components/analytics/ga4"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL("https://query2mail.com"),
  title: {
    default: "Query2Mail — SQL to Excel, Automatically",
    template: "%s | Query2Mail",
  },
  description:
    "Run SQL on a schedule and deliver perfectly formatted Excel reports to any inbox. No BI platform. No dashboards. No logins for recipients.",
  keywords: [
    "sql to excel automation",
    "scheduled sql reports",
    "email database reports",
    "automated reporting tool",
    "sql report scheduler",
    "postgresql excel reports",
    "mysql scheduled email",
    "database reporting without BI",
  ],
  authors: [{ name: "Query2Mail" }],
  creator: "Query2Mail",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://query2mail.com",
    siteName: "Query2Mail",
    title: "Query2Mail — SQL to Excel, Automatically",
    description:
      "Run SQL on a schedule and deliver formatted Excel reports to any inbox. No BI platform. No dashboards. No logins for recipients.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Query2Mail — SQL to Excel, automatically",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Query2Mail — SQL to Excel, Automatically",
    description:
      "Run SQL on a schedule. Deliver formatted Excel to any inbox. No BI platform needed.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const geistMonoHeading = Geist_Mono({subsets:['latin'],variable:'--font-heading'});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", fontSans.variable, "font-mono", jetbrainsMono.variable, geistMonoHeading.variable)}>
        <GA4 />
        <ThemeProvider>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
          <Toaster theme="dark" position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
