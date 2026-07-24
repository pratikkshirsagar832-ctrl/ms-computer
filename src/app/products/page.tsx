"use client"

import { useState, useEffect, useMemo } from "react"

export const dynamic = "force-dynamic"
import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/actions/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import type { Product, ComponentCategory } from "@/lib/types"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { StaggerGrid } from "@/components/ui/fade-in-view"
import {
  Search, ShoppingCart, SlidersHorizontal, Package, Heart,
} from "lucide-react"

const allCategories: (ComponentCategory | "All")[] = [
  "All", "CPU", "Motherboard", "RAM", "GPU", "Storage", "Cabinet",
  "Power Supply", "Monitor", "Keyboard", "Mouse",
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [sortBy, setSortBy] = useState<string>("name")
  const { addItem, toggleCart } = useCartStore()
  const wishlist = useWishlistStore()

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
    }
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter)
    }
    result.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      return a.name.localeCompare(b.name)
    })
    return result
  }, [search, categoryFilter, sortBy, products])

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="relative border-b border-border/40 bg-card/30">
        <div className="hero-orb hero-orb-primary w-[400px] h-[400px] -top-40 -left-20 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="section-tag">Catalog</span>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Our Products
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Browse our full catalog of premium PC components and accessories
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm rounded-xl border-white/10 bg-card/50 focus:border-primary/30 transition-colors"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-[150px] text-sm rounded-xl border-white/10 bg-card/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
            <SelectTrigger className="w-[160px] text-sm rounded-xl border-white/10 bg-card/50">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm ml-auto text-muted-foreground">
            {filtered.length} products
          </p>
        </div>

        {/* Product grid */}
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" staggerDelay={50}>
          {filtered.map((product) => (
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
                  {!product.in_stock && (
                    <Badge className="absolute top-3 right-3 text-[10px] rounded-full bg-destructive/20 text-destructive border-destructive/20">
                      Out of stock
                    </Badge>
                  )}
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
                  <p className="text-xs mt-0.5 text-muted-foreground">{product.brand}</p>
                  <p className="text-lg font-bold mt-2 gradient-text">
                    {formatPrice(product.price)}
                  </p>
                  <Button
                    size="sm"
                    className="w-full mt-3 text-xs font-semibold rounded-full shadow-lg shadow-primary/15 hover:shadow-primary/30 transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault()
                      addItem(product)
                      toggleCart()
                    }}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </StaggerGrid>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">No products found</p>
            <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
