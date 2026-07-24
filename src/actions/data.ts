"use server"

import { supabase, supabaseAdmin } from "@/lib/supabase"
import type { Product, Review, StoreInfo, Order, OrderItem, OrderStatusLog } from "@/lib/types"
import { revalidatePath } from "next/cache"

function mapProduct(raw: Record<string, unknown>): Product {
  let specs: string[] = []
  if (typeof raw.specs === "string") {
    try { specs = JSON.parse(raw.specs) } catch { specs = [] }
  } else if (Array.isArray(raw.specs)) {
    specs = raw.specs as string[]
  }
  return {
    id: raw.id as string,
    name: raw.name as string,
    category: raw.category as Product["category"],
    description: raw.description as string,
    price: raw.price as number,
    image: (raw.image as string) || "/placeholder.svg",
    specs,
    brand: (raw.brand as string) || "",
    in_stock: raw.in_stock as boolean,
  }
}

export async function getStoreInfo(): Promise<StoreInfo | null> {
  const { data } = await supabase.from("store_info").select("*").eq("id", "default").single()
  return data
}

export async function updateStoreInfo(data: Partial<StoreInfo>) {
  const { error } = await supabaseAdmin
    .from("store_info")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", "default")
  if (error) return { success: false, error: error.message }
  revalidatePath("/")
  return { success: true }
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await supabase.from("products").select("*").order("name")
  return (data || []).map(mapProduct)
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase.from("products").select("*").eq("id", id).single()
  return data ? mapProduct(data) : null
}

export async function addProduct(product: Product) {
  const { error } = await supabaseAdmin.from("products").insert({
    ...product,
    specs: JSON.stringify(product.specs),
  })
  if (error) return { success: false, error: error.message }
  revalidatePath("/products")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const payload = { ...data, updated_at: new Date().toISOString() }
  if (payload.specs) payload.specs = JSON.stringify(payload.specs)
  const { error } = await supabaseAdmin.from("products").update(payload).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/products")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/products")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function getReviews(): Promise<Review[]> {
  const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    name: r.name as string,
    rating: r.rating as number,
    text: r.text as string,
    date: r.date as string,
    photo_count: r.photo_count as number,
    review_count: r.review_count as number,
  }))
}

export async function addReview(review: Review) {
  const { error } = await supabaseAdmin.from("reviews").insert(review)
  if (error) return { success: false, error: error.message }
  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function deleteReview(id: string) {
  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/")
  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function createOrder(order: {
  customer_name: string
  customer_phone: string
  customer_email: string
  delivery_address: string
  order_notes: string
  items: { product: Product; quantity: number }[]
  subtotal: number
  delivery_fee: number
  grand_total: number
  payment_id: string
}) {
  const { customer_name, customer_phone, customer_email, delivery_address, order_notes, items, subtotal, delivery_fee, grand_total, payment_id } = order

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      order_notes,
      items: JSON.stringify(items.map(i => ({
        product_id: i.product.id,
        product_name: i.product.name,
        product_image: i.product.image,
        product_price: i.product.price,
        quantity: i.quantity,
      }))),
      subtotal,
      delivery_fee,
      grand_total,
      payment_id,
      payment_status: "completed",
      order_status: "confirmed",
    })
    .select("id")
    .single()

  if (orderError || !orderData) {
    return { success: false, error: orderError?.message || "Failed to create order" }
  }

  const orderId = orderData.id as string

  const orderItems = items.map(item => ({
    order_id: orderId,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.image,
    product_price: item.product.price,
    quantity: item.quantity,
  }))

  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(orderItems)

  if (itemsError) {
    return { success: false, error: itemsError.message }
  }

  await supabaseAdmin
    .from("order_status_log")
    .insert({
      order_id: orderId,
      status: "confirmed",
      note: "Order confirmed via Razorpay payment",
      created_by: "system",
    })

  revalidatePath("/admin/dashboard")
  return { success: true, id: orderId }
}

export async function submitContactMessage(data: { name: string; phone: string; message: string }) {
  const { error } = await supabase.from("contact_messages").insert(data)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: false })
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    customer_name: r.customer_name as string,
    customer_phone: r.customer_phone as string,
    customer_email: r.customer_email as string,
    delivery_address: r.delivery_address as string,
    order_notes: r.order_notes as string,
    items: [],
    subtotal: r.subtotal as number,
    delivery_fee: r.delivery_fee as number,
    grand_total: r.grand_total as number,
    payment_id: r.payment_id as string | null,
    payment_status: r.payment_status as string,
    order_status: r.order_status as string,
    created_at: r.created_at as string,
    updated_at: (r.updated_at as string) || r.created_at as string,
  }))
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single()
  if (!data) return null
  return {
    id: data.id as string,
    customer_name: data.customer_name as string,
    customer_phone: data.customer_phone as string,
    customer_email: data.customer_email as string,
    delivery_address: data.delivery_address as string,
    order_notes: data.order_notes as string,
    items: [],
    subtotal: data.subtotal as number,
    delivery_fee: data.delivery_fee as number,
    grand_total: data.grand_total as number,
    payment_id: data.payment_id as string | null,
    payment_status: data.payment_status as string,
    order_status: data.order_status as string,
    created_at: data.created_at as string,
    updated_at: (data.updated_at as string) || data.created_at as string,
  }
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    order_id: r.order_id as string,
    product_id: r.product_id as string,
    product_name: r.product_name as string,
    product_image: r.product_image as string,
    product_price: r.product_price as number,
    quantity: r.quantity as number,
    created_at: r.created_at as string,
  }))
}

export async function getOrderStatusLogs(orderId: string): Promise<OrderStatusLog[]> {
  const { data } = await supabase
    .from("order_status_log")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true })
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    order_id: r.order_id as string,
    status: r.status as string,
    note: r.note as string,
    created_by: r.created_by as string,
    created_at: r.created_at as string,
  }))
}

export async function getAllOrders(): Promise<Order[]> {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    customer_name: r.customer_name as string,
    customer_phone: r.customer_phone as string,
    customer_email: r.customer_email as string,
    delivery_address: r.delivery_address as string,
    order_notes: r.order_notes as string,
    items: [],
    subtotal: r.subtotal as number,
    delivery_fee: r.delivery_fee as number,
    grand_total: r.grand_total as number,
    payment_id: r.payment_id as string | null,
    payment_status: r.payment_status as string,
    order_status: r.order_status as string,
    created_at: r.created_at as string,
    updated_at: (r.updated_at as string) || r.created_at as string,
  }))
}

export async function getContactMessages() {
  const { data } = await supabaseAdmin
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
  return data || []
}

export async function markContactRead(id: string) {
  const { error } = await supabaseAdmin
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateOrderStatus(orderId: string, status: string, note: string = "") {
  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ order_status: status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
  if (updateError) return { success: false, error: updateError.message }

  const { error: logError } = await supabaseAdmin
    .from("order_status_log")
    .insert({
      order_id: orderId,
      status,
      note,
      created_by: "admin",
    })
  if (logError) return { success: false, error: logError.message }

  revalidatePath("/admin/dashboard")
  return { success: true }
}

export async function getWishlist(phone: string): Promise<string[]> {
  const { data } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("phone", phone)
  return (data || []).map((r: Record<string, unknown>) => r.product_id as string)
}

export async function toggleWishlist(phone: string, productId: string) {
  const existing = await supabase
    .from("wishlist")
    .select("id")
    .eq("phone", phone)
    .eq("product_id", productId)
    .single()

  if (existing.data) {
    const { error } = await supabaseAdmin
      .from("wishlist")
      .delete()
      .eq("id", existing.data.id)
    if (error) return { success: false, error: error.message, added: false }
    return { success: true, added: false }
  }

  const { error } = await supabaseAdmin
    .from("wishlist")
    .insert({ phone, product_id: productId })
  if (error) return { success: false, error: error.message, added: true }
  return { success: true, added: true }
}
