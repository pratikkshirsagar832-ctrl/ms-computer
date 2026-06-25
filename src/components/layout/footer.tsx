import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Clock, Mail, Star } from "lucide-react"
import { storeInfo } from "@/lib/data"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-8 w-8 shrink-0">
                <Image
                  src="/logo.png"
                  alt="MS Computer"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="text-base font-bold text-white">
                MS <span className="text-cyan-400">Computer</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {storeInfo.tagline}. {storeInfo.targetAudience}.
            </p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-white">{storeInfo.rating}</span>
              <span className="text-sm text-zinc-500">
                ({storeInfo.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/builder", label: "PC Builder" },
                { href: "/products", label: "Products" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
                <span className="text-sm text-zinc-400">{storeInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  {storeInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  {storeInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Business Hours
            </h3>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-zinc-400">{storeInfo.hours}</span>
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Visit us for the best deals on custom PCs, laptops, and accessories.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800/60">
          <p className="text-center text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} MS Computer, Sangola. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
