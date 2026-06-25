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
      <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-cyan-400" />
            Your Cart ({items.reduce((c, i) => c + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <ShoppingBag className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">Your cart is empty</p>
            <Button
              variant="link"
              className="text-cyan-400 mt-2"
              onClick={() => setOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 mt-4 h-[60vh]">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-zinc-900/50 rounded-lg p-3"
                  >
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {item.product.category}
                      </p>
                      <p className="text-sm font-semibold text-cyan-400 mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-4 space-y-3">
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white font-semibold">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <Link href="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                  Checkout - {formatPrice(getTotal())}
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
