"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useState } from "react"

const accent = "#408EC6"
const navy = "#0A1128"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/builder", label: "PC Builder" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const { toggleCart, getItemCount } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = getItemCount()

  return (
    <header className="sticky top-0 z-50 w-full border-b" style={{ backgroundColor: navy, borderColor: "rgba(64,142,198,0.15)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/logo.png"
              alt="MS Computer"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              MS <span style={{ color: accent }}>Computer</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm rounded-md transition-colors"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.backgroundColor = "rgba(64,142,198,0.1)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF"; e.currentTarget.style.backgroundColor = "transparent" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative transition-colors"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF" }}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: accent }}>
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
            style={{ color: "#9CA3AF" }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: navy, borderColor: "rgba(64,142,198,0.15)" }}>
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm rounded-md transition-colors"
                style={{ color: "#9CA3AF" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
