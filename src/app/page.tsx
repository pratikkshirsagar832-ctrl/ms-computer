"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { getStoreInfo, getProducts, getReviews } from "@/actions/data"
import type { Product, Review, StoreInfo } from "@/lib/types"
import { categories } from "@/lib/data"
import {
  Star, ArrowRight, Cpu, Shield, Truck,
  Headphones, ChevronRight, MapPin, Phone, Clock, CheckCircle,
  Sparkles, Zap, Wrench, Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FadeInView, StaggerGrid } from "@/components/ui/fade-in-view"
import { useWishlistStore } from "@/store/wishlist-store"
import { Heart } from "lucide-react"

export default function Home() {
  const [store, setStore] = useState<StoreInfo | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getStoreInfo().then(setStore)
    getProducts().then(setProducts)
    getReviews().then(setReviews)
  }, [])

  const featuredProducts = products.filter((p) => p.price > 10000).slice(0, 4)
  const bestSellers = products.filter((p) => p.price > 5000).slice(0, 3)
  const wishlist = useWishlistStore()

  return (
    <div>
      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section ref={heroRef} className="relative overflow-hidden pb-16 sm:pb-24">
        {/* Atmosphere orbs */}
        <div className="hero-orb hero-orb-primary w-[600px] h-[600px] -top-40 -right-40" />
        <div className="hero-orb hero-orb-accent w-[500px] h-[500px] -bottom-32 -left-32" />
        <div className="hero-orb hero-orb-primary w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:pt-28 lg:pt-32 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left content */}
            <div className="space-y-8 stagger-children">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">{store?.rating} ★ Rating</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{store?.review_count}+ Reviews</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.05]">
                Build Your{" "}
                <span className="gradient-text">Dream PC</span>
                <br />
                in Sangola
              </h1>

              {/* Subtitle */}
              <p className="text-lg max-w-lg leading-relaxed text-muted-foreground">
                {store?.tagline}. Premium custom builds for gamers, video editors,
                and AI developers — with expert guidance and local support.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/builder">
                  <Button className="font-semibold px-8 h-12 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 bg-primary hover:bg-primary/90">
                    Build Your PC
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="px-8 h-12 text-base rounded-full border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    Browse Products
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {["/cpu-icon.png", "/gaming-pc.png", "/pc-build.jpg", "/gaming-pc.png"].map(
                    (src, i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted ring-2 ring-primary/10"
                      >
                        <Image
                          src={src}
                          alt="customer"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
                <div>
                  <p className="text-sm text-foreground font-semibold">146+ happy customers</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-lg mx-auto animate-float-slow">
                {/* Glow rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-accent/10 blur-3xl animate-pulse-glow" />
                <div className="absolute inset-8 rounded-full border border-primary/10 animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
                <div className="absolute inset-16 rounded-full border border-primary/5" />

                {/* Main image */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <Image
                    src="/gaming-pc.png"
                    alt="Gaming PC Build"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-10 -left-2 rounded-xl px-5 py-3 shadow-2xl glass animate-float" style={{ animationDelay: "0.3s" }}>
                <p className="text-muted-foreground text-xs">Starting from</p>
                <p className="text-lg font-bold gradient-text">{formatPrice(25000)}</p>
              </div>
              <div className="absolute bottom-14 -right-2 rounded-xl px-5 py-3 shadow-2xl glass animate-float" style={{ animationDelay: "1.5s" }}>
                <p className="text-muted-foreground text-xs">Premium Builds</p>
                <p className="text-sm font-bold text-foreground">3 Year Warranty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          TRUST BAR
          ================================================ */}
      <FadeInView><section className="border-y border-border/40 bg-card/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            {[
              { icon: Shield, label: "Genuine Products", sub: "100% authentic" },
              { icon: Truck, label: "Free Delivery", sub: "In Sangola area" },
              { icon: Headphones, label: "Expert Support", sub: "Tech assistance" },
              { icon: Clock, label: "Fast Service", sub: "Same day delivery" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/15 transition-all duration-300">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section></FadeInView>

      {/* ================================================
          CATEGORIES — BENTO GRID
          ================================================ */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-tag">Categories</span>
            <h2 className="section-heading">What We Offer</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Everything you need under one roof — from components to complete systems
            </p>
          </div>

          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" staggerDelay={60}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="bento-card group flex flex-col items-center gap-4 px-4 py-10 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/15 transition-all duration-300">
                  <cat.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {cat.name}
                </span>
              </Link>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ================================================
          FEATURED PRODUCTS
          ================================================ */}
      <section className="bg-card/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="section-tag">Top Picks</span>
              <h2 className="section-heading">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">Best selling components this month</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors rounded-full px-4 py-2 hover:bg-primary/5"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={70}>
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="bento-card group h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => { e.preventDefault(); wishlist.toggle(product.id) }}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-all duration-200"
                    >
                      <Heart className={`h-4 w-4 transition-all ${
                        wishlist.has(product.id) ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"
                      }`} />
                    </button>
                    <Badge className="absolute top-3 left-3 text-[10px] font-semibold rounded-full bg-primary/20 text-primary border-primary/20">
                      {product.category}
                    </Badge>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-xs font-semibold text-white bg-primary rounded-full px-3 py-1">
                        View Details
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </p>
                    <p className="text-lg font-bold mt-1.5 gradient-text">
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-muted-foreground text-xs">{store?.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </StaggerGrid>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="rounded-full">
                View All Products <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================
          WHY CHOOSE US — BENTO GRID
          ================================================ */}
      <FadeInView><section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-tag">Why Us</span>
            <h2 className="section-heading">Why Choose MS Computer?</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              We deliver quality, trust, and performance
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Cpu, title: "Custom PC Builds", desc: "Tailored systems for gaming, editing & AI", features: ["Premium components", "Optimized cooling", "Cable management"] },
              { icon: Shield, title: "Genuine Products", desc: "100% authentic branded components", features: ["Brand warranty", "Original packaging", "No refurbished"] },
              { icon: Wrench, title: "Expert Assembly", desc: "Professional build & testing service", features: ["BIOS configured", "Stress tested", "Ready to use"] },
              { icon: Award, title: "3 Year Support", desc: "Extended warranty & tech support", features: ["On-site service", "Remote support", "Free diagnostics"] },
            ].map((item, i) => (
              <div
                key={i}
                className="bento-card p-6 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-5 bg-primary/10 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/15 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section></FadeInView>

      {/* ================================================
          STORE SHOWCASE
          ================================================ */}
      <FadeInView><section className="bg-card/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 shadow-2xl group">
              <Image
                src="/out-of-shop.png"
                alt="MS Computer Store"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl glass px-4 py-3">
                <p className="text-sm font-semibold text-foreground">Visit Our Store</p>
                <p className="text-xs text-muted-foreground">{store?.address}</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="pill">
                <MapPin className="h-3.5 w-3.5" />
                Your Local PC Expert
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl leading-tight">
                MS Computer — Sangola&apos;s Premier PC Store
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Located at {store?.address}, we provide premium custom PC builds, gaming
                rigs, laptops, CCTV cameras, and all computer accessories. Our expert team
                helps you choose the right components for your needs and budget.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                  </div>
                  {store?.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <a href={`tel:${store?.phone}`} className="hover:text-primary transition-colors">
                    {store?.phone}
                  </a>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="rounded-full font-medium">
                  Get Directions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section></FadeInView>

      {/* ================================================
          REVIEWS
          ================================================ */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-heading">What Our Customers Say</h2>
            <p className="mt-3 text-muted-foreground">
              <span className="font-bold text-foreground">{store?.rating}</span> out of 5 &bull;{" "}
              {store?.review_count} reviews on Google
            </p>
          </div>

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={100}>
            {reviews.slice(0, 3).map((review) => (
              <Card key={review.id} className="bento-card p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ================================================
          CTA
          ================================================ */}
      <FadeInView><section className="bg-card/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl px-8 py-20 sm:px-20 text-center border border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
            {/* Orbs */}
            <div className="hero-orb hero-orb-primary w-[400px] h-[400px] -top-20 -right-20 opacity-50" />
            <div className="hero-orb hero-orb-accent w-[300px] h-[300px] -bottom-20 -left-20 opacity-40" />

            <div className="relative space-y-6">
              <span className="pill">
                <Zap className="h-3.5 w-3.5" />
                Start Building Today
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-5xl leading-tight">
                Ready to Build Your{" "}
                <span className="gradient-text">Dream PC?</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                Visit our store in Sangola or use our online PC Builder to configure
                your perfect system — we handle the rest.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link href="/builder">
                  <Button className="font-semibold px-8 h-12 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                    <Cpu className="mr-2 h-4 w-4" />
                    Start Building
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="px-8 h-12 text-base rounded-full border-white/10 hover:bg-white/5">
                    <MapPin className="mr-2 h-4 w-4" />
                    Visit Store
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section></FadeInView>

      {/* ================================================
          CONTACT BAR
          ================================================ */}
      <FadeInView><section className="bg-card/40 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
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
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              {store?.hours}
            </div>
          </div>
        </div>
      </section></FadeInView>
    </div>
  )
}
