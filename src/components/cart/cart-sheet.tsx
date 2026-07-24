"use client"

import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export function CartSheet() {
  const { items, open, setOpen, updateQuantity, removeItem, getTotal } = useCartStore()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md border-l border-border/40 bg-card/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            Your Cart
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.reduce((c, i) => c + i.quantity, 0)} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 text-muted-foreground">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-5">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium">Your cart is empty</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Add products to get started</p>
            <Button
              variant="outline"
              className="text-primary mt-6 rounded-full border-white/10"
              onClick={() => setOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 mt-6 h-[58vh]">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-muted/30 rounded-xl p-3 group hover:bg-muted/50 transition-colors duration-200"
                  >
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-background shrink-0 border border-border/20">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.product.category}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2.5">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="flex items-center gap-1 bg-background rounded-full border border-border/40 p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 space-y-4">
              <Separator className="bg-border/40" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-bold gradient-text">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <Link href="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-full font-semibold h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                  Checkout &middot; {formatPrice(getTotal())}
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
