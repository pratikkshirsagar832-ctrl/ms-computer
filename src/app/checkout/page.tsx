"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { createOrder } from "@/actions/data"
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

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")
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

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) return

    setProcessing(true)

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.")
      setProcessing(false)
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID",
      amount: grandTotal * 100,
      currency: "INR",
      name: "MS Computer",
      description: `Order from ${form.name}`,
      handler: async function (response: { razorpay_payment_id: string }) {
        const result = await createOrder({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          delivery_address: form.address,
          order_notes: form.notes,
          items: items,
          subtotal: total,
          delivery_fee: deliveryFee,
          grand_total: grandTotal,
          payment_id: response.razorpay_payment_id,
        })
        if (result.success && result.id) {
          setOrderId(result.id)
        }
        clearCart()
        setProcessing(false)
        setSuccess(true)
      },
      modal: {
        ondismiss: () => {
          setProcessing(false)
        },
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: {
        color: "#C79B35",
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 page-enter">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Order Placed!</h1>
          {orderId && (
            <p className="text-sm text-muted-foreground mt-2">
              Order ID: <span className="font-mono text-primary font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Thank you for your order. We&apos;ll confirm it shortly via phone.
            Visit our store or call us for any updates.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full rounded-full font-semibold shadow-lg shadow-primary/25">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="w-full rounded-full border-white/10">
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
      <div className="min-h-[80vh] flex items-center justify-center px-4 page-enter">
        <div className="text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Add some products to get started</p>
          <Link href="/products">
            <Button className="mt-6 rounded-full font-semibold shadow-lg shadow-primary/25">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 rounded-full px-4 py-2 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl mb-10">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Contact */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8">
                <h2 className="font-display text-lg font-bold text-foreground mb-5">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone *</label>
                      <Input
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Delivery Address *
                    </label>
                    <Textarea
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Shop No, Street, City, District, Pincode"
                      className="min-h-[100px] rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Order Notes</label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any special requests or instructions..."
                      className="min-h-[80px] rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8">
                <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </h2>
                <div className="rounded-xl bg-muted/30 border border-border/40 p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Razorpay</p>
                    <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking & more</p>
                  </div>
                  <Badge className="ml-auto rounded-full font-semibold">Secure</Badge>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8 lg:sticky lg:top-24 shadow-xl">
                <h2 className="font-display text-lg font-bold text-foreground mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-background shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate font-semibold">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs text-primary font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-5 bg-border/40" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400 font-semibold">Free</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-muted-foreground/60">
                      Free delivery on orders above {formatPrice(5000)}
                    </p>
                  )}
                </div>

                <Separator className="my-5 bg-border/40" />

                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-foreground">Total</span>
                  <span className="font-display text-2xl font-bold gradient-text">
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 h-12 text-base rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
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

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground/60">
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
