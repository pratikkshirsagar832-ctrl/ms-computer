"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProduct, getProducts } from "@/actions/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/lib/types"
import { useWishlistStore } from "@/store/wishlist-store"
import { FadeInView, StaggerGrid } from "@/components/ui/fade-in-view"
import {
  ShoppingCart,
  Star,
  CheckCircle,
  ChevronLeft,
  Shield,
  Truck,
  Cpu,
  Heart,
} from "lucide-react"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const { addItem, toggleCart } = useCartStore()
  const wishlist = useWishlistStore()

  useEffect(() => {
    if (!id) return
    getProduct(id).then((p) => {
      if (!p) { notFound(); return }
      setProduct(p)
      getProducts().then((all) =>
        setRelated(all.filter((r) => r.category === p.category && r.id !== p.id).slice(0, 3))
      )
    })
  }, [id])

  if (!product) return null

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 rounded-full px-4 py-2 hover:bg-white/5"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <FadeInView><div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl bg-card border border-border/40 overflow-hidden group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <Badge className="absolute top-4 left-4 rounded-full bg-primary/20 text-primary border-primary/20 font-semibold">
              {product.category}
            </Badge>
            {!product.in_stock && (
              <Badge className="absolute top-4 right-4 rounded-full bg-destructive/20 text-destructive border-destructive/20 font-semibold">
                Out of Stock
              </Badge>
            )}
            {/* Glow on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 80px oklch(0.52 0.2 270 / 6%)",
              }}
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-semibold">{product.brand}</p>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl mt-1">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">5.0</span>
              <span className="text-sm text-muted-foreground">(146 reviews)</span>
            </div>

            {/* Price */}
            <p className="font-display text-3xl font-bold gradient-text">
              {formatPrice(product.price)}
            </p>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <Separator className="bg-border/40" />

            {/* Specs */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                Key Specifications
              </h3>
              <ul className="space-y-2">
                {product.specs.map((spec, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="bg-border/40" />

            {/* Add to cart */}
            <div className="flex items-center gap-3">
              <Button
                className="flex-1 h-12 text-base font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                disabled={!product.in_stock}
                onClick={() => {
                  addItem(product)
                  toggleCart()
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <button
                onClick={() => wishlist.toggle(product.id)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border/40 hover:bg-white/5 transition-all duration-200"
              >
                <Heart className={`h-5 w-5 transition-all ${
                  wishlist.has(product.id) ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground"
                }`} />
              </button>
            </div>

            {/* Info badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Secure Payment via Razorpay
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5 text-emerald-400" />
                Free Delivery in Sangola
              </div>
            </div>
          </div>
        </div></FadeInView>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <span className="section-tag">Similar</span>
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              More {product.category}s
            </h2>
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={60}>
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <div className="bento-card group p-4">
                    <div className="relative aspect-[4/3] bg-muted/50 rounded-xl overflow-hidden mb-4">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {p.name}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </StaggerGrid>
          </div>
        )}
      </div>
    </div>
  )
}
