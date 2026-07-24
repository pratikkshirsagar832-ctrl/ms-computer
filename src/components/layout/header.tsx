"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, Cpu, Heart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/builder", label: "PC Builder" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const { toggleCart, getItemCount } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = getItemCount()
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
            <Image
              src="/logo.png"
              alt="MS Computer"
              fill
              sizes="40px"
              className="object-contain p-1"
            />
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg tracking-tight text-foreground">
              MS <span className="gradient-text">Computer</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  isActive
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
          >
            <Heart className="h-4 w-4" />
          </Link>

          {/* PC Builder CTA */}
          <Link href="/builder" className="hidden sm:block">
            <Button
              size="sm"
              className="rounded-full font-semibold text-xs bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <Cpu className="h-3.5 w-3.5 mr-1.5" />
              Build PC
            </Button>
          </Link>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className={cn(
              "relative rounded-full transition-all duration-300",
              "text-muted-foreground hover:text-foreground hover:bg-white/5",
              itemCount > 0 && "text-foreground"
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <>
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white bg-accent animate-scale-in shadow-lg shadow-accent/40">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
                <span className="absolute inset-0 rounded-full animate-pulse-glow-accent" />
              </>
            )}
          </Button>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-80 border-t border-border/40" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-4 py-3 gap-1 bg-background/95 backdrop-blur">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Link href="/builder" className="mt-1">
            <Button className="w-full rounded-xl font-semibold text-sm shadow-lg shadow-primary/25">
              <Cpu className="h-4 w-4 mr-2" />
              Build Your PC
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
