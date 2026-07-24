"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getStoreInfo } from "@/actions/data"
import { Card, CardContent } from "@/components/ui/card"
import type { StoreInfo } from "@/lib/types"
import { FadeInView, StaggerGrid } from "@/components/ui/fade-in-view"
import { Star, Store, Users, Award, Shield, MapPin } from "lucide-react"

export default function AboutPage() {
  const [store, setStore] = useState<StoreInfo | null>(null)

  useEffect(() => {
    getStoreInfo().then(setStore)
  }, [])

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="relative border-b border-border/40 bg-card/30 overflow-hidden">
        <div className="hero-orb hero-orb-primary w-[400px] h-[400px] -top-40 right-10 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="section-tag">Our Story</span>
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl leading-tight">
              About{" "}
              <span className="gradient-text">MS Computer</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Your trusted computer hardware store in Sangola, Maharashtra —
              serving gamers, professionals, and businesses with premium custom PCs.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Image + text */}
        <FadeInView><div className="grid gap-10 lg:grid-cols-2 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/40 shadow-2xl group">
            <Image
              src="/out-of-shop.png"
              alt="MS Computer Store"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
          <div className="space-y-5">
            <span className="pill">
              <MapPin className="h-3.5 w-3.5" />
              Sangola, Maharashtra
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Your Local Computer Expert
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Located at {store?.address}, MS Computer is a premier destination
              for custom PC builds, laptops, computer components, CCTV cameras, and
              accessories. We cater to everyone from daily users to hardcore gamers
              and AI/LLM developers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We stock the latest brands including Intel, AMD, NVIDIA, Corsair, MSI,
              ASUS, and more. Our team provides expert advice to help you choose the
              right components for your needs and budget.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold text-foreground">{store?.rating}</span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{store?.review_count}+ reviews</span>
            </div>
          </div>
        </div></FadeInView>

        {/* Stats */}
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-20" staggerDelay={80}>
          {[
            { icon: Store, label: "Products", value: "500+" },
            { icon: Users, label: "Happy Customers", value: "1000+" },
            { icon: Award, label: "Years Experience", value: "5+" },
            { icon: Shield, label: "Brands Available", value: "20+" },
          ].map((stat) => (
            <Card key={stat.label} className="bento-card text-center py-8">
              <CardContent className="p-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/10 mx-auto mb-4">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </StaggerGrid>

        {/* Why choose us grid */}
        <div className="space-y-10">
          <div className="text-center">
            <span className="section-tag">Why Us</span>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Why Choose MS Computer?
            </h2>
          </div>
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Genuine Products", desc: "100% authentic branded components with full manufacturer warranty." },
              { title: "Expert Guidance", desc: "Knowledgeable staff to help you build the perfect system for your needs." },
              { title: "Competitive Pricing", desc: "Best prices in Sangola with regular deals, offers, and bundle discounts." },
              { title: "Custom Builds", desc: "Tailored systems for gaming, video editing, AI development, and more." },
              { title: "After-Sales Support", desc: "Reliable service and technical support long after your purchase." },
              { title: "Free Delivery", desc: "Complimentary local delivery in the Sangola area on all orders." },
            ].map((item) => (
              <Card key={item.title} className="bento-card p-6 group">
                <h3 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
          </StaggerGrid>
        </div>
      </div>
    </div>
  )
}
