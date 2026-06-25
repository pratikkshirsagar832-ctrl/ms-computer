"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import {
  ShoppingBag,
  Shield,
  Truck,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react"

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  })

  const total = getTotal()
  const deliveryFee = total >= 5000 ? 0 : 199
  const grandTotal = total + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) return
    setProcessing(true)

    // Simulate Razorpay payment flow
    await new Promise((r) => setTimeout(r, 2000))
    setProcessing(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-black px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Order Placed! 🎉</h1>
          <p className="text-zinc-400 mt-3">
            Thank you for your order. We&apos;ll confirm it shortly via phone.
            Visit our store or call us for any updates.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full border-zinc-700 text-zinc-300">
                Contact Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-black px-4">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white">Your cart is empty</h1>
          <p className="text-zinc-500 mt-2">Add some products to get started</p>
          <Link href="/products">
            <Button className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-black">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-2xl font-bold text-white sm:text-3xl mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-1.5 block">Full Name *</label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-zinc-400 mb-1.5 block">Phone *</label>
                      <Input
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400 mb-1.5 block">Email</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-1.5 block">
                      Delivery Address *
                    </label>
                    <Textarea
                      required
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Shop No, Street, City, District, Pincode"
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-1.5 block">Order Notes</label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      placeholder="Any special requests or instructions..."
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-cyan-400" />
                  Payment Method
                </h2>
                <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Razorpay</p>
                    <p className="text-xs text-zinc-500">Pay via UPI, Cards, Net Banking</p>
                  </div>
                  <Badge className="ml-auto bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                    Secure
                  </Badge>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3"
                    >
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4 bg-zinc-800" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Delivery</span>
                    <span className="text-white">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400">Free</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-zinc-600">
                      Free delivery on orders above ₹5,000
                    </p>
                  )}
                </div>

                <Separator className="my-4 bg-zinc-800" />

                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-white">Total</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold h-12 text-base disabled:opacity-50"
                  disabled={processing || !form.name || !form.phone || !form.address}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Pay {formatPrice(grandTotal)}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-600">
                  <Truck className="h-3.5 w-3.5" />
                  Free delivery in Sangola area
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
