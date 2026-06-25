"use client"

import { ComponentCategory, Product } from "@/lib/types"
import { useBuilderStore } from "@/store/builder-store"
import { useCartStore } from "@/store/cart-store"
import { products } from "@/lib/data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { X, ShoppingCart, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const accent = "#408EC6"
const navy = "#0A1128"

interface BuilderSelectProps {
  category: ComponentCategory
  index: number
}

const categoryLabels: Record<string, string> = {
  CPU: "Processor",
  Motherboard: "Motherboard",
  RAM: "Memory",
  GPU: "Graphics Card",
  Storage: "Storage",
  Cabinet: "Case",
  "Power Supply": "PSU",
}

export function BuilderSelect({ category, index }: BuilderSelectProps) {
  const { selection, setComponent, removeComponent } = useBuilderStore()
  const { addItem } = useCartStore()
  const selected = selection[category]
  const categoryProducts = products.filter((p) => p.category === category)

  return (
    <Card className="transition-all duration-300 border-0" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: navy }}>
              {index + 1}. {category}
            </span>
          </div>
          {selected && (
            <Badge variant="outline" className="text-xs font-medium border-0" style={{ backgroundColor: "rgba(64,142,198,0.1)", color: accent }}>
              Selected
            </Badge>
          )}
        </div>

        {selected ? (
          <div className="flex items-center gap-3 rounded-lg p-2.5" style={{ backgroundColor: "#F5F5F5" }}>
            <div className="relative h-12 w-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: "#FFFFFF" }}>
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                sizes="96px"
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: navy }}>{selected.name}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>
                {formatPrice(selected.price)}
              </p>
            </div>
            <button
              onClick={() => removeComponent(category)}
              className="p-1.5 rounded-full transition-colors"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF" }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Select
            onValueChange={(id) => {
              if (!id) return
              const product = categoryProducts.find((p) => p.id === id)
              if (product) setComponent(category, product)
            }}
          >
            <SelectTrigger
              className="w-full text-sm h-10"
              style={{ backgroundColor: "#F5F5F5", borderColor: "#E5E7EB", color: "#9CA3AF" }}
            >
              <SelectValue placeholder={`Select ${categoryLabels[category] || category}...`} />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
              {categoryProducts.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id}
                  disabled={!product.inStock}
                  style={{ color: navy }}
                >
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>{product.name}</span>
                    <span className="font-medium" style={{ color: accent }}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  )
}
