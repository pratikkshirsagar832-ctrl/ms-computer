import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSheet } from "@/components/cart/cart-sheet"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MS Computer - Premium Custom PC & Laptop Store in Sangola",
  description:
    "MS Computer in Sangola - Your destination for custom PC builds, gaming rigs, laptops, CCTV cameras, and computer accessories. Intel, AMD, NVIDIA, and more.",
  keywords: [
    "MS Computer", "Sangola", "computer store", "PC builder", "gaming PC",
    "laptop", "custom PC", "CCTV", "Sangola Maharashtra",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MS Computer - Premium Custom PC Store",
    description:
      "Custom PC builds for gaming, rendering, and AI development in Sangola, Maharashtra.",
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh flex flex-col bg-black text-zinc-100 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSheet />
      </body>
    </html>
  )
}
