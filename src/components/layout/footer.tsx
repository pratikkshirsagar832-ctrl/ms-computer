import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Clock, Mail, Star, ArrowUpRight, Cpu } from "lucide-react"
import { getStoreInfo } from "@/actions/data"
import { Button } from "@/components/ui/button"

export async function Footer() {
  const store = await getStoreInfo()

  const linkGroups = [
    {
      title: "Shop",
      links: [
        { href: "/products", label: "All Products" },
        { href: "/builder", label: "PC Builder" },
        { href: "/wishlist", label: "Wishlist" },
        { href: "/orders", label: "My Orders" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
        { href: "/products?category=Accessories", label: "Accessories" },
        { href: "/products?category=CCTV Camera", label: "CCTV Cameras" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "Help Center" },
        { href: "/about", label: "Our Store" },
        { href: "/checkout", label: "Checkout" },
      ],
    },
  ]

  return (
    <footer className="relative border-t border-border/40 bg-card/50">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="MS Computer"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <span className="font-display text-lg tracking-tight text-foreground">
                MS <span className="gradient-text">Computer</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {store?.tagline}. Premium custom PC builds, gaming rigs, laptops,
              and accessories for {store?.target_audience} in Sangola, Maharashtra.
            </p>
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{store?.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({store?.review_count} reviews)
              </span>
            </div>
            {/* Quick CTA */}
            <Link href="/builder">
              <Button className="rounded-full font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5">
                <Cpu className="h-4 w-4 mr-2" />
                Build Your Dream PC
              </Button>
            </Link>
          </div>

          {/* Link Groups */}
          {linkGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="font-display text-sm tracking-wider text-foreground/80">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              {store?.address}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-3.5 w-3.5 text-primary" />
              </div>
              <a href={`tel:${store?.phone}`} className="hover:text-primary transition-colors">
                {store?.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-3.5 w-3.5 text-primary" />
              </div>
              <a href={`mailto:${store?.email}`} className="hover:text-primary transition-colors">
                {store?.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              {store?.hours}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} MS Computer, Sangola. All rights reserved.
            &mdash; Premium Custom PCs &amp; Computer Store.
          </p>
        </div>
      </div>
    </footer>
  )
}
