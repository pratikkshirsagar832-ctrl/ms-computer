"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/data"
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
import { ComponentCategory } from "@/lib/types"
import { useCartStore } from "@/store/cart-store"
import { Search, ShoppingCart, Star, SlidersHorizontal } from "lucide-react"

const accent = "#408EC6"
const navy = "#0A1128"

const allCategories: (ComponentCategory | "All")[] = [
  "All", "CPU", "Motherboard", "RAM", "GPU", "Storage", "Cabinet",
  "Power Supply", "Monitor", "Keyboard", "Mouse",
]

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [sortBy, setSortBy] = useState<string>("name")
  const { addItem, toggleCart } = useCartStore()

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
  }, [search, categoryFilter, sortBy])

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <div className="border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold" style={{ color: navy }}>Products</h1>
          <p style={{ color: "#6B7280" }} className="mt-1">
            Browse our full catalog of PC components and accessories
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9CA3AF" }} />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
              style={{ borderColor: "#E5E7EB", backgroundColor: "#FFFFFF", color: navy }}
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-[140px] text-sm" style={{ borderColor: "#E5E7EB", backgroundColor: "#FFFFFF", color: navy }}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat} style={{ color: navy }}>{cat === "All" ? "All Categories" : cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => v && setSortBy(v)}>
            <SelectTrigger className="w-[140px] text-sm" style={{ borderColor: "#E5E7EB", backgroundColor: "#FFFFFF", color: navy }}>
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
              <SelectItem value="name" style={{ color: navy }}>Name</SelectItem>
              <SelectItem value="price-asc" style={{ color: navy }}>Price: Low to High</SelectItem>
              <SelectItem value="price-desc" style={{ color: navy }}>Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm ml-auto" style={{ color: "#9CA3AF" }}>
            {filtered.length} products
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card
                className="group overflow-hidden transition-all duration-300 border-0 h-full"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#F5F5F5" }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge
                    className="absolute top-3 left-3 text-xs font-medium border-0"
                    style={{ backgroundColor: accent, color: "#FFFFFF" }}
                  >
                    {product.category}
                  </Badge>
                  {!product.inStock && (
                    <Badge variant="outline" className="absolute top-3 right-3 text-xs border-0" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                      Out of stock
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <p className="text-sm font-medium truncate" style={{ color: navy }}>
                    {product.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{product.brand}</p>
                  <p className="text-lg font-bold mt-2" style={{ color: accent }}>
                    {formatPrice(product.price)}
                  </p>
                  <Button
                    size="sm"
                    className="w-full mt-3 text-xs font-medium border-0"
                    style={{ backgroundColor: accent, color: "#FFFFFF" }}
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
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-medium" style={{ color: navy }}>No products found</p>
            <p style={{ color: "#9CA3AF" }} className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
