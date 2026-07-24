import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSheet } from "@/components/cart/cart-sheet"

const displayFont = Geist({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
})

const bodyFont = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

const monoFont = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MS Computer — Premium Custom PC & Gaming Store | Sangola",
  description:
    "MS Computer in Sangola — Build your dream gaming PC, shop laptops, CCTV cameras, and premium computer accessories. Intel, AMD, NVIDIA, custom builds with expert guidance.",
  keywords: [
    "MS Computer", "Sangola", "computer store", "PC builder", "gaming PC",
    "custom PC build", "laptop store", "CCTV camera", "Sangola Maharashtra",
    "gaming rig", "PC components",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MS Computer — Premium Custom PC & Gaming Store",
    description:
      "Custom PC builds for gaming, rendering, and AI. Premium components, expert assembly, and local support in Sangola, Maharashtra.",
    type: "website",
    locale: "en_IN",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} dark`}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans antialiased bg-mesh">
        <Header />
        <main className="flex-1 page-enter">{children}</main>
        <Footer />
        <CartSheet />
      </body>
    </html>
  )
}
