"use client"

import { useBuilderStore } from "@/store/builder-store"
import { useCartStore } from "@/store/cart-store"
import { BuilderSelect } from "@/components/builder/builder-select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import type { ComponentCategory } from "@/lib/types"
import { FadeInView, StaggerGrid } from "@/components/ui/fade-in-view"
import {
  ShoppingCart, RotateCcw, AlertTriangle, CheckCircle2, Cpu,
  Sparkles, Zap,
} from "lucide-react"
import Link from "next/link"

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
    <div className="page-enter">
      {/* Header */}
      <div className="relative border-b border-border/40 bg-card/30 overflow-hidden">
        <div className="hero-orb hero-orb-primary w-[350px] h-[350px] -top-40 right-10 opacity-30" />
        <div className="hero-orb hero-orb-accent w-[250px] h-[250px] -bottom-20 left-10 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25 animate-pulse-glow">
              <Cpu className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <span className="section-tag">Build Your Own</span>
              <h1 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
                Custom PC Builder
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Pick each component — we assemble & deliver
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Component selection */}
          <div className="lg:col-span-2 space-y-4">
            <StaggerGrid className="grid gap-4 sm:grid-cols-2">
              {categories.map((category, index) => (
                <BuilderSelect
                  key={category}
                  category={category}
                  index={index}
                />
              ))}
            </StaggerGrid>

            {/* Bottom bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full px-3 py-1.5 hover:bg-white/5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Build
              </button>

              <div className="flex items-center gap-2 text-sm">
                {complete ? (
                  <Badge className="font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Build Complete
                  </Badge>
                ) : (
                  <Badge className="font-semibold rounded-full bg-amber-500/10 text-amber-400 border-amber-500/20">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    {missing.length} remaining
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="rounded-2xl p-6 bg-card border border-border/40 shadow-xl">
                <h3 className="font-display text-lg font-bold mb-5 text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Build Summary
                </h3>

                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{cat}</span>
                      {selection[cat] ? (
                        <span className="font-semibold text-primary">
                          {formatPrice(selection[cat]!.price)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30">&mdash;</span>
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-4 bg-border/40" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold gradient-text">
                    {formatPrice(total)}
                  </span>
                </div>

                {missing.length > 0 && (
                  <p className="text-xs mt-3 flex items-center gap-1 text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    Select {missing.join(", ")}
                  </p>
                )}

                <Button
                  className="w-full mt-5 font-semibold h-12 rounded-full disabled:opacity-40 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                  disabled={!complete}
                  onClick={addAllToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add All to Cart &middot; {formatPrice(total)}
                </Button>

                <p className="text-xs text-center mt-3 text-muted-foreground/60">
                  Prices include all taxes
                </p>
              </div>

              {/* Help box */}
              <div className="rounded-2xl p-5 bg-card border border-border/40">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Need Help?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Not sure which components to choose?{" "}
                  <Link href="/contact" className="text-primary font-medium hover:underline">
                    Contact our experts
                  </Link>{" "}
                  for personalized build advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
