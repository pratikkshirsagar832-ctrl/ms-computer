"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/admin"
import {
  getStoreInfo, updateStoreInfo,
  getProducts, addProduct, updateProduct, deleteProduct,
  getReviews, addReview, deleteReview,
} from "@/actions/data"
import Lightfall from "@/components/admin/Lightfall"
import {
  Store, Package, Star, LogOut, Plus, Pencil, Trash2,
  Save, LayoutDashboard, Menu, X,
} from "lucide-react"
import { storeInfo as defaultStore } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import type { Product, Review } from "@/lib/types"

const accent = "#408EC6"
const navy = "#0A1128"

type Tab = "store" | "products" | "reviews"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("store")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [store, setStore] = useState(defaultStore)
  const [productsList, setProductsList] = useState<Product[]>([])
  const [reviewsList, setReviewsList] = useState<Review[]>([])
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState("")

  const showSnack = (msg: string) => {
    setSnackbar(msg)
    setTimeout(() => setSnackbar(""), 2500)
  }

  useEffect(() => {
    getStoreInfo().then(setStore)
    getProducts().then(setProductsList)
    getReviews().then(setReviewsList)
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

  const tabs: { key: Tab; label: string; icon: typeof Store }[] = [
    { key: "store", label: "Store Info", icon: Store },
    { key: "products", label: "Products", icon: Package },
    { key: "reviews", label: "Reviews", icon: Star },
  ]

  return (
    <div className="min-h-dvh flex" style={{ backgroundColor: "#F5F5F5" }}>
      {sidebarOpen && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)} style={{ backgroundColor: "rgba(10,17,40,0.4)" }} />}

      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed md:relative md:translate-x-0 z-50 md:z-auto w-64 h-dvh transition-transform duration-300 overflow-y-auto`} style={{ backgroundColor: navy, borderRight: "1px solid rgba(64,142,198,0.15)" }}>
        <div className="p-5 border-b" style={{ borderColor: "rgba(64,142,198,0.15)" }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: accent }}>
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">MS Computer</p>
              <p style={{ color: "#6B7280" }} className="text-[10px]">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg transition-colors" style={{ color: "#6B7280" }}>
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
                tab === t.key ? "font-medium" : ""
              }`}
              style={{
                color: tab === t.key ? accent : "#6B7280",
                backgroundColor: tab === t.key ? "rgba(64,142,198,0.1)" : "transparent",
              }}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t mt-auto" style={{ borderColor: "rgba(64,142,198,0.15)" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all w-full"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.backgroundColor = "transparent" }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-dvh relative">
        <Lightfall
          colors={["#408EC6", "#0A1128", "#7AB8E0"]}
          backgroundColor="#F5F5F5"
          speed={0.6}
          density={0.3}
          opacity={0.25}
        />

        <div className="relative z-10 flex flex-col min-h-dvh">
          {/* Top bar */}
          <div className="px-4 md:px-6 py-3 flex items-center gap-4" style={{ backgroundColor: "rgba(10,17,40,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(64,142,198,0.15)" }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="transition-colors md:hidden" style={{ color: "#9CA3AF" }}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base md:text-lg font-semibold capitalize text-white">
              {tabs.find((t) => t.key === tab)?.label || "Dashboard"}
            </h2>
          </div>

          {/* Content */}
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
            {tab === "reviews" && (
              <ReviewsEditor
                reviews={reviewsList}
                setReviews={setReviewsList}
                onDelete={handleDeleteReview}
                showSnack={showSnack}
              />
            )}
          </div>

          {/* Mobile bottom tabs */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex" style={{ backgroundColor: "rgba(10,17,40,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(64,142,198,0.15)" }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSidebarOpen(false) }}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-all"
                style={{ color: tab === t.key ? accent : "#6B7280", fontWeight: tab === t.key ? "500" : "400" }}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px]"
              style={{ color: "#6B7280" }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Snackbar */}
        {snackbar && (
          <div className="fixed bottom-6 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-2xl text-sm" style={{ backgroundColor: navy }}>
            {snackbar}
          </div>
        )}
      </div>
    </div>
  )
}

function StoreEditor({
  store, setStore, onSave, saving,
}: {
  store: typeof defaultStore
  setStore: (s: typeof defaultStore) => void
  onSave: () => void
  saving: boolean
}) {
  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl p-6 space-y-5" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: navy }}>
          <Store className="h-4 w-4" style={{ color: accent }} />
          Store Details
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {([
            { label: "Business Name", key: "name", type: "text" },
            { label: "Tagline", key: "tagline", type: "text" },
            { label: "Phone", key: "phone", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Hours", key: "hours", type: "text" },
            { label: "Rating", key: "rating", type: "number" },
          ] as const).map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>{field.label}</label>
              <input
                type={field.type}
                value={String(store[field.key] ?? "")}
                onChange={(e) => setStore({ ...store, [field.key]: field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }}
                onFocus={(e) => { e.target.style.borderColor = accent }}
                onBlur={(e) => { e.target.style.borderColor = "#E5E7EB" }}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Address</label>
          <textarea
            value={store.address}
            onChange={(e) => setStore({ ...store, address: e.target.value })}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
            style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }}
            onFocus={(e) => { e.target.style.borderColor = accent }}
            onBlur={(e) => { e.target.style.borderColor = "#E5E7EB" }}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-lg border-0"
            style={{ backgroundColor: accent }}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
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
    price: 0, image: "/pc.png", specs: "", brand: "", inStock: true,
  })

  const resetForm = () => {
    setForm({ id: "", name: "", category: "CPU", description: "", price: 0, image: "/pc.png", specs: "", brand: "", inStock: true })
    setEditId(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id, name: product.name, category: product.category,
      description: product.description, price: product.price,
      image: product.image, specs: product.specs.join(", "), brand: product.brand,
      inStock: product.inStock,
    })
    setEditId(product.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.description || form.price < 0) return
    const specsArr = form.specs.split(",").map((s) => s.trim()).filter(Boolean)
    if (editId) {
      const updated = { name: form.name, category: form.category, description: form.description, price: form.price, image: form.image, specs: specsArr, brand: form.brand, inStock: form.inStock }
      await updateProduct(editId, updated)
      setProducts(products.map((p) => p.id === editId ? { ...p, ...updated } : p))
      showSnack("Product updated!")
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`, name: form.name, category: form.category,
        description: form.description, price: form.price, image: form.image,
        specs: specsArr, brand: form.brand, inStock: form.inStock,
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
        <p style={{ color: "#6B7280" }} className="text-sm">{products.length} products</p>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg border-0" style={{ backgroundColor: accent }}>
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-6 space-y-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 className="text-sm font-semibold" style={{ color: navy }}>{editId ? "Edit Product" : "New Product"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }}>
                {["CPU", "Motherboard", "RAM", "GPU", "Storage", "Cabinet", "Power Supply", "Monitor", "Keyboard", "Mouse", "Accessory"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Specs (comma separated)</label>
              <input value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} placeholder="e.g. 8GB DDR4, 3200MHz, CL16" className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Image Path</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="inStock" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="rounded" style={{ borderColor: "#D1D5DB", accentColor: accent }} />
              <label htmlFor="inStock" className="text-sm" style={{ color: "#6B7280" }}>In Stock</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={resetForm} className="px-4 py-2 rounded-lg text-sm transition-all" style={{ border: "1px solid #E5E7EB", color: "#6B7280", backgroundColor: "#FFFFFF" }}>Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 shadow-lg border-0" style={{ backgroundColor: accent }}>
              <Save className="h-4 w-4" />
              {editId ? "Update" : "Add"} Product
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 px-5 py-4 transition-colors" style={{ borderColor: "#F3F4F6" }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: navy }}>{product.name}</p>
                <p style={{ color: "#9CA3AF" }} className="text-xs">{product.category} &middot; {product.brand}</p>
              </div>
              <p className="text-sm font-semibold" style={{ color: accent }}>{formatPrice(product.price)}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(product)} className="p-2 rounded-lg transition-all" style={{ color: "#9CA3AF" }} onMouseEnter={(e) => { e.currentTarget.style.color = accent }} onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF" }}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(product.id)} className="p-2 rounded-lg transition-all" style={{ color: "#9CA3AF" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444" }} onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF" }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: "#9CA3AF" }}>No products yet</div>
          )}
        </div>
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
        <p style={{ color: "#6B7280" }} className="text-sm">{reviews.length} reviews</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-all shadow-lg border-0" style={{ backgroundColor: accent }}>
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Add Review"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-6 space-y-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Rating</label>
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Review Text</label>
              <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all" style={{ border: "1px solid #E5E7EB", backgroundColor: "#F5F5F5", color: navy }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = "#E5E7EB"} />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 shadow-lg border-0" style={{ backgroundColor: accent }}>
              <Plus className="h-4 w-4" />
              Add Review
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-4 px-5 py-4 transition-colors" style={{ borderColor: "#F3F4F6" }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium" style={{ color: navy }}>{review.name}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm line-clamp-2" style={{ color: "#6B7280" }}>&ldquo;{review.text}&rdquo;</p>
                <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>{review.date}</p>
              </div>
              <button onClick={() => onDelete(review.id)} className="p-2 rounded-lg transition-all shrink-0" style={{ color: "#9CA3AF" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444" }} onMouseLeave={(e) => { e.currentTarget.style.color = "#9CA3AF" }}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
