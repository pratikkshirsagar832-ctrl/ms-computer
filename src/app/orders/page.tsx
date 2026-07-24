"use client"

import { useState } from "react"
import { getOrdersByPhone } from "@/actions/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/lib/types"
import Link from "next/link"
import {
  Package, Search, Phone, ChevronRight, Clock,
  CheckCircle, Truck, AlertCircle, Loader2,
} from "lucide-react"

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-500/15 text-purple-400 border-purple-500/20", icon: Truck },
  shipped: { label: "Shipped", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20", icon: Truck },
  delivered: { label: "Delivered", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive/15 text-destructive border-destructive/20", icon: AlertCircle },
}

export default function OrdersPage() {
  const [phone, setPhone] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setSearched(true)
    const result = await getOrdersByPhone(phone.trim())
    setOrders(result)
    setLoading(false)
  }

  return (
    <div className="page-enter">
      <div className="relative border-b border-border/40 bg-card/30 overflow-hidden">
        <div className="hero-orb hero-orb-primary w-[400px] h-[400px] -top-40 right-10 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="section-tag">Orders</span>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Track Your Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your phone number to view all your orders
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="pl-9 text-sm rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl font-semibold shadow-lg shadow-primary/25"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </form>

        {searched && !loading && orders.length === 0 && (
          <div className="text-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
              <Package className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">No orders found</h2>
            <p className="text-muted-foreground mt-2">No orders associated with this phone number</p>
            <Link href="/products">
              <Button className="mt-6 rounded-full font-semibold shadow-lg shadow-primary/25">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.order_status] || statusConfig.pending
            const StatusIcon = status.icon
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block rounded-2xl border border-border/40 bg-card p-5 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <Badge className={`rounded-full text-[10px] font-semibold ${status.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_name} &middot; {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {order.delivery_address}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-lg font-bold gradient-text">
                      {formatPrice(order.grand_total)}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
