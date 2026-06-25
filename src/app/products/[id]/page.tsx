"use client"

import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"
import {
  ShoppingCart,
  Star,
  CheckCircle,
  ChevronLeft,
  Info,
} from "lucide-react"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const product = products.find((p) => p.id === id)
  const { addItem, toggleCart } = useCartStore()

  if (!product) {
    notFound()
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square rounded-xl bg-zinc-900/80 border border-zinc-800 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
            <Badge className="absolute top-4 left-4 bg-cyan-500/90 text-black border-0">
              {product.category}
            </Badge>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-cyan-400 font-medium">{product.brand}</p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl mt-1">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-white">5.0</span>
              </div>
              <span className="text-sm text-zinc-500">(146 reviews)</span>
            </div>

            <p className="text-3xl font-bold text-cyan-400">
              {formatPrice(product.price)}
            </p>

            <p className="text-zinc-400 leading-relaxed">{product.description}</p>

            <Separator className="bg-zinc-800" />

            <div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-cyan-400" />
                Key Specifications
              </h3>
              <ul className="space-y-2">
                {product.specs.map((spec, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="flex items-center gap-4">
              <Button
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold h-12 text-base"
                disabled={!product.inStock}
                onClick={() => {
                  addItem(product)
                  toggleCart()
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              {!product.inStock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
              <p className="text-xs text-zinc-500">
                <span className="text-zinc-400 font-medium">💳 Secure Payment</span> — Pay
                via Razorpay (UPI, Cards, Net Banking)
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                <span className="text-zinc-400 font-medium">🚚 Free Delivery</span> in
                Sangola area on orders above ₹5,000
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">
              More {product.category}s
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`}>
                  <div className="group rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 hover:border-cyan-500/40 transition-all">
                    <div className="relative aspect-[4/3] bg-zinc-800/50 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                      {p.name}
                    </p>
                    <p className="text-sm font-bold text-cyan-400 mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
