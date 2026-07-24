"use client"

import { useEffect, useState } from "react"
import { ComponentCategory, Product } from "@/lib/types"
import { useBuilderStore } from "@/store/builder-store"
import { getProducts } from "@/actions/data"
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
import { X, CheckCircle2 } from "lucide-react"
import Image from "next/image"

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

const categoryIcons: Record<string, string> = {
  CPU: "🔲",
  Motherboard: "🔳",
  RAM: "📊",
  GPU: "🎯",
  Storage: "💾",
  Cabinet: "🏗️",
  "Power Supply": "⚡",
}

export function BuilderSelect({ category, index }: BuilderSelectProps) {
  const { selection, setComponent, removeComponent } = useBuilderStore()
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const selected = selection[category]

  useEffect(() => {
    getProducts().then((all) =>
      setCategoryProducts(all.filter((p) => p.category === category))
    )
  }, [category])

  return (
    <Card className="bento-card transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <span className="text-sm font-bold text-foreground">
              {category}
            </span>
          </div>
          {selected && (
            <Badge className="rounded-full bg-emerald-500/15 text-emerald-400 border-emerald-500/20 font-semibold text-[10px]">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Selected
            </Badge>
          )}
        </div>

        {selected ? (
          <div className="flex items-center gap-3 rounded-xl p-3 bg-primary/5 border border-primary/10">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-background">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                sizes="96px"
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-foreground">{selected.name}</p>
              <p className="text-xs font-bold mt-0.5 text-primary">
                {formatPrice(selected.price)}
              </p>
            </div>
            <button
              onClick={() => removeComponent(category)}
              className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
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
            <SelectTrigger className="w-full text-sm h-10 rounded-xl border-white/10 bg-card/50 hover:border-primary/30 transition-colors">
              <SelectValue placeholder={`Select ${categoryLabels[category] || category}...`} />
            </SelectTrigger>
            <SelectContent>
              {categoryProducts.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id}
                  disabled={!product.in_stock}
                >
                  <div className="flex items-center justify-between w-full gap-4">
                    <span className="truncate">{product.name}</span>
                    <span className="font-semibold text-primary shrink-0">
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
