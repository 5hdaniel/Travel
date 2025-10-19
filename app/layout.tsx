import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/hooks/use-auth"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { OfflineIndicator } from "@/components/pwa/offline-indicator"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "TravelShare - Share Your Journey",
  description: "Keep friends and family connected to your travels with real-time updates and beautiful timelines",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TravelShare",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TravelShare",
    title: "TravelShare - Share Your Journey",
    description: "Keep friends and family connected to your travels with real-time updates and beautiful timelines",
  },
  twitter: {
    card: "summary",
    title: "TravelShare - Share Your Journey",
    description: "Keep friends and family connected to your travels with real-time updates and beautiful timelines",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="TravelShare" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TravelShare" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />

        <link rel="apple-touch-icon" href="/placeholder.svg?height=180&width=180" />
        <link rel="icon" type="image/png" sizes="32x32" href="/placeholder.svg?height=32&width=32" />
        <link rel="icon" type="image/png" sizes="16x16" href="/placeholder.svg?height=16&width=16" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`font-sans ${inter.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            {children}
            <InstallPrompt />
            <OfflineIndicator />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
