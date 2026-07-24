"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getOrderById, getOrderItems, getOrderStatusLogs } from "@/actions/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { FadeInView } from "@/components/ui/fade-in-view"
import type { Order, OrderItem, OrderStatusLog } from "@/lib/types"
import {
  ChevronLeft, Package, Clock, CheckCircle, Truck, AlertCircle,
  MapPin, Phone, CreditCard, Loader2,
} from "lucide-react"

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-500/15 text-purple-400 border-purple-500/20", icon: Truck },
  shipped: { label: "Shipped", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20", icon: Truck },
  delivered: { label: "Delivered", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive/15 text-destructive border-destructive/20", icon: AlertCircle },
}

const statusFlow = ["pending", "confirmed", "processing", "shipped", "delivered"]

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [logs, setLogs] = useState<OrderStatusLog[]>([])

  useEffect(() => {
    if (!id) return
    getOrderById(id).then(setOrder)
    getOrderItems(id).then(setItems)
    getOrderStatusLogs(id).then(setLogs)
  }, [id])

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const status = statusConfig[order.order_status] || statusConfig.pending
  const StatusIcon = status.icon
  const currentStep = statusFlow.indexOf(order.order_status)

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 rounded-full px-4 py-2 hover:bg-white/5"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <Badge className={`rounded-full font-semibold ${status.color}`}>
            <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
            {status.label}
          </Badge>
        </div>

        <FadeInView>
          <div className="rounded-2xl border border-border/40 bg-card p-6 mb-6">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Order Status
            </h2>
            <div className="flex items-center gap-1">
              {statusFlow.map((s, i) => {
                const cfg = statusConfig[s]
                const isComplete = i <= currentStep
                const isCurrent = i === currentStep
                return (
                  <div key={s} className="flex-1 flex flex-col items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                      isComplete
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-muted text-muted-foreground"
                    } ${isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
                      {isComplete ? <CheckCircle className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 font-medium text-center ${
                      isComplete ? "text-foreground" : "text-muted-foreground/50"
                    }`}>
                      {cfg.label}
                    </span>
                    {i < statusFlow.length - 1 && (
                      <div className={`h-0.5 w-full -mt-4 ml-4 transition-colors duration-300 ${
                        i < currentStep ? "bg-primary" : "bg-muted"
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </FadeInView>

        <div className="grid gap-6 lg:grid-cols-5 mb-6">
          <div className="lg:col-span-3 space-y-6">
            <FadeInView>
              <div className="rounded-2xl border border-border/40 bg-card p-6">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Items ({items.length})
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-xl bg-muted/30 p-3">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-background shrink-0 border border-border/20">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          sizes="64px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: {item.quantity} &times; {formatPrice(item.product_price)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(item.product_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={80}>
              <div className="rounded-2xl border border-border/40 bg-card p-6">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Status History
                </h2>
                <div className="space-y-3">
                  {logs.map((log) => {
                    const cfg = statusConfig[log.status] || statusConfig.pending
                    const LogIcon = cfg.icon
                    return (
                      <div key={log.id} className="flex items-start gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                          <LogIcon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{cfg.label}</p>
                          {log.note && (
                            <p className="text-xs text-muted-foreground">{log.note}</p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                            {new Date(log.created_at).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </FadeInView>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <FadeInView delay={120}>
              <div className="rounded-2xl border border-border/40 bg-card p-6">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Delivery Address
                </h2>
                <p className="text-sm text-foreground font-medium">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground mt-1">{order.delivery_address}</p>
                <a href={`tel:${order.customer_phone}`} className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {order.customer_phone}
                </a>
                {order.customer_email && (
                  <p className="text-sm text-muted-foreground mt-1">{order.customer_email}</p>
                )}
                {order.order_notes && (
                  <>
                    <Separator className="my-3 bg-border/40" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Notes:</span> {order.order_notes}
                    </p>
                  </>
                )}
              </div>
            </FadeInView>

            <FadeInView delay={160}>
              <div className="rounded-2xl border border-border/40 bg-card p-6">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground font-medium">
                      {order.delivery_fee === 0 ? <span className="text-emerald-400">Free</span> : formatPrice(order.delivery_fee)}
                    </span>
                  </div>
                  <Separator className="my-2 bg-border/40" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <span className="font-display text-xl font-bold gradient-text">
                      {formatPrice(order.grand_total)}
                    </span>
                  </div>
                  {order.payment_id && (
                    <p className="text-[10px] text-muted-foreground/60 mt-2">
                      Payment ID: {order.payment_id}
                    </p>
                  )}
                </div>
              </div>
            </FadeInView>
          </div>
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button className="rounded-full font-semibold shadow-lg shadow-primary/25">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
