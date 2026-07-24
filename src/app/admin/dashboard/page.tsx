"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/admin"
import {
  getStoreInfo, updateStoreInfo,
  getProducts, addProduct, updateProduct, deleteProduct,
  getReviews, addReview, deleteReview,
  getAllOrders, updateOrderStatus, getContactMessages, markContactRead,
} from "@/actions/data"
import {
  Store, Package, Star, LogOut, Plus, Pencil, Trash2,
  Save, LayoutDashboard, Menu, X, ShoppingBag, MessageSquare,
  CheckCircle, Clock, Truck, AlertCircle, Eye,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { Product, Review, StoreInfo, Order } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Tab = "store" | "products" | "reviews" | "orders" | "messages"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  confirmed: { label: "Confirmed", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  processing: { label: "Processing", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  shipped: { label: "Shipped", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20" },
  delivered: { label: "Delivered", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelled", color: "bg-destructive/15 text-destructive border-destructive/20" },
}

const defaultStore: StoreInfo = {
  id: "default",
  name: "MS Computer",
  name_marathi: "एमएस कंप्यूटर",
  tagline: "Premium Custom PC & Laptop Store",
  rating: 5.0,
  review_count: 146,
  address: "",
  phone: "",
  email: "",
  hours: "",
  map_link: "",
  target_audience: "Gamers, Video Editors & AI/LLM Developers",
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("store")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [store, setStore] = useState<StoreInfo>(defaultStore)
  const [productsList, setProductsList] = useState<Product[]>([])
  const [reviewsList, setReviewsList] = useState<Review[]>([])
  const [ordersList, setOrdersList] = useState<Order[]>([])
  const [messagesList, setMessagesList] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState("")

  const showSnack = (msg: string) => {
    setSnackbar(msg)
    setTimeout(() => setSnackbar(""), 2500)
  }

  useEffect(() => {
    getStoreInfo().then((s) => s && setStore(s))
    getProducts().then(setProductsList)
    getReviews().then(setReviewsList)
    getAllOrders().then(setOrdersList)
    getContactMessages().then(setMessagesList)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  const handleStoreSave = async () => {
    setSaving(true)
    const result = await updateStoreInfo(store)
    if (result.success) showSnack("Store info updated!")
    setSaving(false)
  }

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id)
    setProductsList((prev) => prev.filter((p) => p.id !== id))
    showSnack("Product deleted")
  }

  const handleDeleteReview = async (id: string) => {
    await deleteReview(id)
    setReviewsList((prev) => prev.filter((r) => r.id !== id))
    showSnack("Review deleted")
  }

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const result = await updateOrderStatus(orderId, status)
    if (result.success) {
      setOrdersList((prev) => prev.map((o) => o.id === orderId ? { ...o, order_status: status } : o))
      showSnack(`Order ${statusConfig[status]?.label || status}`)
    }
  }

  const handleMarkRead = async (id: string) => {
    await markContactRead(id)
    setMessagesList((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m))
  }

  const tabs: { key: Tab; label: string; icon: typeof Store }[] = [
    { key: "store", label: "Store Info", icon: Store },
    { key: "products", label: "Products", icon: Package },
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "reviews", label: "Reviews", icon: Star },
    { key: "messages", label: "Messages", icon: MessageSquare },
  ]

  return (
    <div className="min-h-dvh flex bg-background">
      {sidebarOpen && <div className="fixed inset-0 z-40 md:hidden bg-black/40" onClick={() => setSidebarOpen(false)} />}

      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed md:relative md:translate-x-0 z-50 md:z-auto w-64 h-dvh transition-transform duration-300 overflow-y-auto bg-card border-r border-border/40`}>
        <div className="p-5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">MS Computer</p>
              <p className="text-muted-foreground text-[10px]">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                tab === t.key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.key === "orders" && ordersList.filter(o => o.order_status === "pending" || o.order_status === "confirmed").length > 0 && (
                <span className="ml-auto bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {ordersList.filter(o => o.order_status === "pending" || o.order_status === "confirmed").length}
                </span>
              )}
              {t.key === "messages" && messagesList.filter((m: any) => !m.is_read).length > 0 && (
                <span className="ml-auto bg-destructive/20 text-destructive text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {messagesList.filter((m: any) => !m.is_read).length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border/40 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-dvh">
        <div className="px-4 md:px-6 py-3 flex items-center gap-4 bg-card/80 backdrop-blur-sm border-b border-border/40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="text-base md:text-lg font-semibold capitalize text-foreground">
            {tabs.find((t) => t.key === tab)?.label || "Dashboard"}
          </h2>
        </div>

        <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-x-hidden">
          {tab === "store" && (
            <StoreEditor store={store} setStore={setStore} onSave={handleStoreSave} saving={saving} />
          )}
          {tab === "products" && (
            <ProductsEditor
              products={productsList}
              setProducts={setProductsList}
              onDelete={handleDeleteProduct}
              showSnack={showSnack}
            />
          )}
          {tab === "orders" && (
            <OrdersEditor orders={ordersList} onUpdateStatus={handleUpdateStatus} />
          )}
          {tab === "reviews" && (
            <ReviewsEditor
              reviews={reviewsList}
              setReviews={setReviewsList}
              onDelete={handleDeleteReview}
              showSnack={showSnack}
            />
          )}
          {tab === "messages" && (
            <MessagesEditor messages={messagesList} onMarkRead={handleMarkRead} />
          )}
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-card/95 backdrop-blur-sm border-t border-border/40">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSidebarOpen(false) }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-all ${
                tab === t.key ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
          <button onClick={handleLogout} className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {snackbar && (
        <div className="fixed bottom-6 right-6 z-50 text-primary-foreground px-5 py-3 rounded-xl shadow-2xl text-sm bg-primary">
          {snackbar}
        </div>
      )}
    </div>
  )
}

function StoreEditor({
  store, setStore, onSave, saving,
}: {
  store: StoreInfo
  setStore: (s: StoreInfo) => void
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl p-6 space-y-5 bg-card border border-border/40 shadow-sm">
        <h3 className="text-base font-semibold flex items-center gap-2 text-foreground">
          <Store className="h-4 w-4 text-primary" />
          Store Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { label: "Business Name", key: "name" as const, type: "text" },
            { label: "Tagline", key: "tagline" as const, type: "text" },
            { label: "Phone", key: "phone" as const, type: "text" },
            { label: "Email", key: "email" as const, type: "email" },
            { label: "Hours", key: "hours" as const, type: "text" },
            { label: "Rating", key: "rating" as const, type: "number" },
            { label: "Review Count", key: "review_count" as const, type: "number" },
          ]).map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">{field.label}</label>
              <Input
                type={field.type}
                value={String(store[field.key] ?? "")}
                onChange={(e) => setStore({ ...store, [field.key]: field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-muted-foreground">Address</label>
          <Textarea value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} rows={2} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-muted-foreground">Map Link</label>
          <Input type="text" value={store.map_link} onChange={(e) => setStore({ ...store, map_link: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-muted-foreground">Target Audience</label>
          <Input type="text" value={store.target_audience} onChange={(e) => setStore({ ...store, target_audience: e.target.value })} />
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={onSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProductsEditor({
  products, setProducts, onDelete, showSnack,
}: {
  products: Product[]
  setProducts: (p: Product[]) => void
  onDelete: (id: string) => void
  showSnack: (msg: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    id: "", name: "", category: "CPU" as Product["category"], description: "",
    price: 0, image: "/placeholder.svg", specs: "", brand: "", in_stock: true,
  })

  const resetForm = () => {
    setForm({ id: "", name: "", category: "CPU", description: "", price: 0, image: "/placeholder.svg", specs: "", brand: "", in_stock: true })
    setEditId(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id, name: product.name, category: product.category,
      description: product.description, price: product.price,
      image: product.image, specs: product.specs.join(", "), brand: product.brand,
      in_stock: product.in_stock,
    })
    setEditId(product.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.description || form.price < 0) return
    const specsArr = form.specs.split(",").map((s) => s.trim()).filter(Boolean)
    if (editId) {
      const updated = { name: form.name, category: form.category, description: form.description, price: form.price, image: form.image, specs: specsArr, brand: form.brand, in_stock: form.in_stock }
      await updateProduct(editId, updated)
      setProducts(products.map((p) => p.id === editId ? { ...p, ...updated } : p))
      showSnack("Product updated!")
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`, name: form.name, category: form.category,
        description: form.description, price: form.price, image: form.image,
        specs: specsArr, brand: form.brand, in_stock: form.in_stock,
      }
      await addProduct(newProduct)
      setProducts([...products, newProduct])
      showSnack("Product added!")
    }
    resetForm()
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm">{products.length} products</p>
        <Button onClick={() => { resetForm(); setShowForm(!showForm) }} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-6 space-y-4 bg-card border border-border/40 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">{editId ? "Edit Product" : "New Product"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })} className="w-full px-3 py-2 rounded-lg text-sm bg-background border border-input text-foreground outline-none focus:border-ring">
                {["CPU", "Motherboard", "RAM", "GPU", "Storage", "Cabinet", "Power Supply", "Monitor", "Keyboard", "Mouse", "Accessory"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Price (₹)</label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Brand</label>
              <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Specs (comma separated)</label>
              <Input value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} placeholder="e.g. 8GB DDR4, 3200MHz, CL16" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Image Path</label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="inStock" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="rounded accent-primary" />
              <label htmlFor="inStock" className="text-sm text-muted-foreground">In Stock</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {editId ? "Update" : "Add"} Product
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm">
        <div className="divide-y divide-border/40">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground">{product.name}</p>
                <p className="text-muted-foreground text-xs">{product.category} &middot; {product.brand}</p>
              </div>
              <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(product.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">No products yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

function OrdersEditor({
  orders, onUpdateStatus,
}: {
  orders: Order[]
  onUpdateStatus: (id: string, status: string) => void
}) {
  const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="max-w-6xl">
      <p className="text-muted-foreground text-sm mb-4">{orders.length} total orders</p>
      <div className="space-y-3">
        {orders.map((order) => {
          const cfg = statusConfig[order.order_status] || statusConfig.pending
          return (
            <div key={order.id} className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">#{order.id.slice(0, 8)}</span>
                    <Badge className={`rounded-full text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.customer_name} &middot; {order.customer_phone}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.grand_total)}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                </div>
              </button>

              {expandedId === order.id && (
                <div className="px-5 pb-4 pt-0 border-t border-border/40">
                  <div className="grid gap-3 sm:grid-cols-2 mt-3 mb-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">Delivery</p>
                      <p className="text-xs text-foreground">{order.delivery_address}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      {order.order_notes && <p className="text-xs text-muted-foreground mt-1">Note: {order.order_notes}</p>}
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">Payment</p>
                      <p className="text-xs text-foreground">{order.payment_id ? `ID: ${order.payment_id}` : "No payment"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{order.payment_status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase mr-1">Update Status:</span>
                    {statusOptions.map((s) => {
                      const sc = statusConfig[s]
                      return (
                        <button
                          key={s}
                          onClick={() => onUpdateStatus(order.id, s)}
                          className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all ${
                            order.order_status === s
                              ? `${sc.color} border-current`
                              : "text-muted-foreground border-border/40 hover:border-foreground/30 hover:text-foreground"
                          }`}
                        >
                          {sc.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {orders.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No orders yet</div>
        )}
      </div>
    </div>
  )
}

function ReviewsEditor({
  reviews, setReviews, onDelete, showSnack,
}: {
  reviews: Review[]
  setReviews: (r: Review[]) => void
  onDelete: (id: string) => void
  showSnack: (msg: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", text: "", rating: 5 })

  const handleAdd = async () => {
    if (!form.name || !form.text) return
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: form.name,
      rating: form.rating,
      text: form.text,
      date: "just now",
    }
    await addReview(newReview)
    setReviews([newReview, ...reviews])
    showSnack("Review added!")
    setForm({ name: "", text: "", rating: 5 })
    setShowForm(false)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm">{reviews.length} reviews</p>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Add Review"}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-6 space-y-4 bg-card border border-border/40 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Rating</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full px-3 py-2 rounded-lg text-sm bg-background border border-input text-foreground outline-none focus:border-ring">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1 text-muted-foreground">Review Text</label>
              <Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm">
        <div className="divide-y divide-border/40">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{review.name}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm line-clamp-2 text-muted-foreground">&ldquo;{review.text}&rdquo;</p>
                <p className="text-xs mt-1 text-muted-foreground/60">{review.date}</p>
              </div>
              <button onClick={() => onDelete(review.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MessagesEditor({
  messages, onMarkRead,
}: {
  messages: any[]
  onMarkRead: (id: string) => void
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-muted-foreground text-sm mb-4">{messages.length} messages</p>
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-2xl p-5 border transition-all ${
              msg.is_read ? "bg-card border-border/40" : "bg-card border-primary/20 shadow-sm"
            }`}
            onClick={() => !msg.is_read && onMarkRead(msg.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">{msg.name}</span>
                  {!msg.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{msg.phone}</p>
                <p className="text-sm text-foreground mt-2">{msg.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-2">
                  {new Date(msg.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              {!msg.is_read && (
                <button
                  onClick={(e) => { e.stopPropagation(); onMarkRead(msg.id) }}
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No messages</div>
        )}
      </div>
    </div>
  )
}
