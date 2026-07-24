"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/actions/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/lib/types"
import {
  Heart, ShoppingCart, ArrowLeft, Trash2, Package,
} from "lucide-react"

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const wishlist = useWishlistStore()
  const { addItem, toggleCart } = useCartStore()

  useEffect(() => {
    getProducts().then((all) => {
      setProducts(all.filter((p) => wishlist.items.includes(p.id)))
      setLoading(false)
    })
  }, [wishlist.items])

  const wishlistProducts = products.filter((p) => wishlist.items.includes(p.id))

  return (
    <div className="page-enter">
      <div className="relative border-b border-border/40 bg-card/30 overflow-hidden">
        <div className="hero-orb hero-orb-accent w-[350px] h-[350px] -top-40 right-10 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="section-tag">Saved</span>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Your Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            {wishlistProducts.length} saved {wishlistProducts.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/40 overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-4 skeleton w-3/4" />
                  <div className="h-6 skeleton w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
              <Heart className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Your wishlist is empty</h2>
            <p className="text-muted-foreground mt-2">Save items you love by tapping the heart icon</p>
            <Link href="/products">
              <Button className="mt-6 rounded-full font-semibold shadow-lg shadow-primary/25">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="bento-card group h-full">
                <Link href={`/products/${product.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 text-[10px] font-semibold rounded-full bg-primary/20 text-primary border-primary/20">
                      {product.category}
                    </Badge>
                    <button
                      onClick={(e) => { e.preventDefault(); wishlist.toggle(product.id) }}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border/40 hover:bg-background transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </Link>
                <CardContent className="p-5">
                  <Link href={`/products/${product.id}`}>
                    <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </p>
                    <p className="text-lg font-bold mt-1.5 gradient-text">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                  <Button
                    size="sm"
                    className="w-full mt-3 text-xs font-semibold rounded-full shadow-lg shadow-primary/15 hover:shadow-primary/30 transition-all duration-300"
                    onClick={() => { addItem(product); toggleCart() }}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
