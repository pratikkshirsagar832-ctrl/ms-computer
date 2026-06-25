"use client"

import { useBuilderStore } from "@/store/builder-store"
import { useCartStore } from "@/store/cart-store"
import { BuilderSelect } from "@/components/builder/builder-select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { ComponentCategory } from "@/lib/types"
import {
  ShoppingCart, RotateCcw, AlertTriangle, CheckCircle2, Cpu,
} from "lucide-react"
import Link from "next/link"

const accent = "#408EC6"
const navy = "#0A1128"

const categories: ComponentCategory[] = [
  "CPU", "Motherboard", "RAM", "GPU", "Storage", "Cabinet", "Power Supply",
]

export default function BuilderPage() {
  const { selection, getTotal, isComplete, getMissingCategories, reset } = useBuilderStore()
  const { addItem, toggleCart } = useCartStore()

  const missing = getMissingCategories()
  const total = getTotal()
  const complete = isComplete()

  const addAllToCart = () => {
    Object.values(selection).forEach((product) => {
      if (product) addItem(product)
    })
    toggleCart()
  }

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <div className="border-b" style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: accent }}>
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: navy }}>
                Custom PC Builder
              </h1>
              <p style={{ color: "#6B7280" }} className="text-sm">
                Select components to build your perfect machine
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category, index) => (
                <BuilderSelect
                  key={category}
                  category={category}
                  index={index}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = navy }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF" }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Build
              </button>

              <div className="flex items-center gap-2 text-sm">
                {complete ? (
                  <Badge className="font-medium border-0" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Build Complete
                  </Badge>
                ) : (
                  <Badge variant="outline" style={{ borderColor: "rgba(245,158,11,0.3)", color: "#F59E0B", backgroundColor: "rgba(245,158,11,0.08)" }}>
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    {missing.length} categories remaining
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: navy }}>
                  Build Summary
                </h3>

                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span style={{ color: "#9CA3AF" }}>{cat}</span>
                      {selection[cat] ? (
                        <span className="font-medium" style={{ color: accent }}>
                          {formatPrice(selection[cat]!.price)}
                        </span>
                      ) : (
                        <span style={{ color: "#D1D5DB" }}>&mdash;</span>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-4" style={{ backgroundColor: "#F3F4F6" }} />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold" style={{ color: navy }}>
                    Total
                  </span>
                  <span className="text-2xl font-bold" style={{ color: accent }}>
                    {formatPrice(total)}
                  </span>
                </div>

                {missing.length > 0 && (
                  <p className="text-xs mt-3 flex items-center gap-1" style={{ color: "#F59E0B" }}>
                    <AlertTriangle className="h-3 w-3" />
                    Select {missing.join(", ")}
                  </p>
                )}

                <Button
                  className="w-full mt-4 text-white font-semibold h-12 disabled:opacity-40 border-0"
                  style={{ backgroundColor: accent }}
                  disabled={!complete}
                  onClick={addAllToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart &middot; {formatPrice(total)}
                </Button>

                <p className="text-xs text-center mt-3" style={{ color: "#9CA3AF" }}>
                  Prices include all taxes
                </p>
              </div>

              <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: navy }}>
                  Need Help?
                </h4>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Not sure which components to choose?{" "}
                  <Link
                    href="/contact"
                    style={{ color: accent }}
                  >
                    Contact us
                  </Link>{" "}
                  for expert advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
