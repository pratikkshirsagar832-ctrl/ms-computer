import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : supabase

export type Tables = {
  products: {
    id: string
    name: string
    category: string
    description: string
    price: number
    image: string
    specs: string[]
    brand: string
    in_stock: boolean
    created_at: string
    updated_at: string
  }
  reviews: {
    id: string
    name: string
    rating: number
    text: string
    date: string
    photo_count: number
    review_count: number
    created_at: string
  }
  store_info: {
    id: string
    name: string
    name_marathi: string
    tagline: string
    rating: number
    review_count: number
    address: string
    phone: string
    email: string
    hours: string
    map_link: string
    target_audience: string
    updated_at: string
  }
  orders: {
    id: string
    customer_name: string
    customer_phone: string
    customer_email: string
    delivery_address: string
    order_notes: string
    items: Record<string, unknown>
    subtotal: number
    delivery_fee: number
    grand_total: number
    payment_id: string | null
    payment_status: string
    order_status: string
    created_at: string
  }
  contact_messages: {
    id: string
    name: string
    phone: string
    message: string
    created_at: string
  }
}
