"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storeInfo, products, reviews, categories } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import {
  Star, ArrowRight, Monitor, Cpu, Gamepad2, Shield, Truck,
  Headphones, ChevronRight, MapPin, Phone, Clock, CheckCircle,
} from "lucide-react"

const accent = "#408EC6"
const navy = "#0A1128"

export default function Home() {
  const featuredProducts = products.filter((p) => p.price > 10000).slice(0, 8)

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: navy }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#408EC6]/20 via-transparent to-[#0A1128]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#408EC6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0A1128]/40 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#408EC6]/30 bg-[#408EC6]/10 px-4 py-1.5 text-sm" style={{ color: "#408EC6" }}>
                <Star className="h-3.5 w-3.5 fill-[#408EC6]" />
                {storeInfo.rating} Rating &bull; {storeInfo.reviewCount}+ Reviews
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                Build Your{" "}
                <span style={{ color: "#408EC6" }}>
                  Dream PC
                </span>{" "}
                in Sangola
              </h1>
              <p className="text-lg max-w-lg leading-relaxed" style={{ color: "#9CA3AF" }}>
                {storeInfo.tagline}. Premium custom builds for gamers, video editors, and AI
                developers at the best prices in Sangola, Maharashtra.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/builder">
                  <Button className="text-white font-semibold px-8 h-12 text-base border-0" style={{ backgroundColor: accent }}>
                    Build Your PC
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="text-[#9CA3AF] px-8 h-12 text-base"
                    style={{ borderColor: "rgba(255,255,255,0.15)" }}
                  >
                    Browse Products
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {["/cpu-icon.png", "/gaming-pc.png", "/pc-build.jpg", "/gaming-pc.png"].map(
                    (src, i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full border-2 border-[#0A1128] overflow-hidden"
                        style={{ backgroundColor: "#1a1a2e" }}
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
                <p style={{ color: "#6B7280" }}>
                  <span className="font-semibold text-white">146+</span> happy customers
                </p>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#408EC6]/20 to-[#0A1128]/40 rounded-full blur-3xl" />
                <Image
                  src="/gaming-pc.png"
                  alt="Gaming PC"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain relative z-10 drop-shadow-2xl"
                  priority
                />
              </div>

              <div className="absolute top-8 -left-4 rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm" style={{ backgroundColor: "rgba(10,17,40,0.95)", border: "1px solid rgba(64,142,198,0.2)" }}>
                <p style={{ color: "#9CA3AF" }} className="text-xs">Starting from</p>
                <p className="text-sm font-bold" style={{ color: accent }}>{formatPrice(25000)}</p>
              </div>
              <div className="absolute bottom-12 -right-4 rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm" style={{ backgroundColor: "rgba(10,17,40,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "#9CA3AF" }} className="text-xs">Premium</p>
                <p className="text-sm font-bold text-white">Quality Builds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ backgroundColor: navy, borderTop: "1px solid rgba(64,142,198,0.1)" }}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            {[
              { icon: Shield, label: "Genuine Products", sub: "100% authentic" },
              { icon: Truck, label: "Free Delivery", sub: "In Sangola area" },
              { icon: Headphones, label: "Expert Support", sub: "Tech assistance" },
              { icon: Clock, label: "Fast Service", sub: "Same day delivery" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(64,142,198,0.15)" }}>
                  <item.icon className="h-5 w-5" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p style={{ color: "#6B7280" }} className="text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: navy }}>
              What We Offer
            </h2>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              Everything you need under one roof
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className="flex flex-col items-center gap-3 rounded-xl px-4 py-8 text-center transition-all duration-300 group hover:shadow-lg"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(64,142,198,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                }}
              >
                <div className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                <span className="text-sm font-medium transition-colors" style={{ color: navy }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: navy }}>Featured Products</h2>
              <p className="mt-2" style={{ color: "#6B7280" }}>Top selling items this month</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: accent }}
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card
                  className="group overflow-hidden transition-all duration-300 border-0"
                  style={{
                    backgroundColor: "#F5F5F5",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge
                      className="absolute top-3 left-3 text-xs border-0 font-medium"
                      style={{ backgroundColor: accent, color: "#FFFFFF" }}
                    >
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium truncate transition-colors" style={{ color: navy }}>
                      {product.name}
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ color: accent }}>
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span style={{ color: "#9CA3AF" }} className="text-xs">{storeInfo.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/products">
              <Button
                variant="outline"
                style={{ borderColor: accent, color: accent }}
              >
                View All Products <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: navy }}>Why Choose MS Computer?</h2>
            <p className="mt-3" style={{ color: "#6B7280" }}>We deliver quality and trust</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Cpu, title: "Custom PC Builds", desc: "Tailored systems for gaming, editing & AI", features: ["Premium components", "Optimized cooling", "Cable management"] },
              { icon: Shield, title: "Genuine Products", desc: "100% authentic branded components", features: ["Brand warranty", "Original packaging", "No refurbished"] },
              { icon: Truck, title: "Free Delivery", desc: "Free local delivery in Sangola area", features: ["Same day delivery", "Safe packaging", "Doorstep service"] },
              { icon: Headphones, title: "Expert Support", desc: "Professional tech support & service", features: ["On-site service", "Remote support", "Extended warranty"] },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-6 transition-all duration-300"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg mb-4" style={{ backgroundColor: "rgba(64,142,198,0.1)" }}>
                  <item.icon className="h-6 w-6" style={{ color: accent }} />
                </div>
                <h3 className="text-base font-semibold mb-1" style={{ color: navy }}>{item.title}</h3>
                <p style={{ color: "#6B7280" }} className="text-sm mb-3">{item.desc}</p>
                <ul className="space-y-1.5">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                      <CheckCircle className="h-3 w-3" style={{ color: accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Showcase */}
      <section style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(10,17,40,0.12)" }}>
              <Image
                src="/out-of-shop.png"
                alt="MS Computer Store"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium" style={{ backgroundColor: "rgba(64,142,198,0.1)", color: accent }}>
                Visit Our Store
              </span>
              <h2 className="text-3xl font-bold" style={{ color: navy }}>
                MS Computer — Your Local PC Expert in Sangola
              </h2>
              <p style={{ color: "#6B7280" }} className="leading-relaxed">
                Located at {storeInfo.address}, we provide premium custom PC builds, laptops,
                CCTV cameras, and all computer accessories. Visit us for personalized service
                and the best deals in town.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: accent }} />
                  {storeInfo.address}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
                  <Phone className="h-4 w-4 shrink-0" style={{ color: accent }} />
                  {storeInfo.phone}
                </div>
              </div>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="font-medium mt-2"
                  style={{ borderColor: accent, color: accent }}
                >
                  Get Directions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold" style={{ color: navy }}>What Our Customers Say</h2>
            <p className="mt-3" style={{ color: "#6B7280" }}>
              {storeInfo.rating} out of 5 &bull; {storeInfo.reviewCount} reviews
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <Card
                key={review.id}
                className="border-0"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: navy }}>{review.name}</p>
                      <p style={{ color: "#9CA3AF" }} className="text-xs">{review.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: navy }}>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl px-8 py-16 text-center sm:px-20" style={{ backgroundColor: "rgba(64,142,198,0.08)", border: "1px solid rgba(64,142,198,0.15)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#408EC6]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0A1128]/30 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Build Your Dream PC?
              </h2>
              <p style={{ color: "#9CA3AF" }} className="mt-4 max-w-lg mx-auto">
                Visit our store in Sangola or use our online PC Builder to configure
                your perfect system.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/builder">
                  <Button className="text-white font-semibold px-8 h-12 text-base border-0" style={{ backgroundColor: accent }}>
                    Start Building
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="text-white px-8 h-12 text-base"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    Visit Store
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info Bar */}
      <section style={{ backgroundColor: navy, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2" style={{ color: "#6B7280" }}>
              <MapPin className="h-4 w-4" style={{ color: accent }} />
              {storeInfo.address}
            </div>
            <div className="flex items-center gap-2" style={{ color: "#6B7280" }}>
              <Phone className="h-4 w-4" style={{ color: accent }} />
              {storeInfo.phone}
            </div>
            <div className="flex items-center gap-2" style={{ color: "#6B7280" }}>
              <Clock className="h-4 w-4" style={{ color: accent }} />
              {storeInfo.hours}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
