export interface Product {
  id: string
  name: string
  category: ComponentCategory
  description: string
  price: number
  image: string
  specs: string[]
  brand: string
  in_stock: boolean
}

export type ComponentCategory =
  | "CPU"
  | "Motherboard"
  | "RAM"
  | "GPU"
  | "Storage"
  | "Cabinet"
  | "Power Supply"
  | "Monitor"
  | "Keyboard"
  | "Mouse"
  | "Accessory"

export interface BuilderSelection {
  [key: string]: Product | null
  CPU: Product | null
  Motherboard: Product | null
  RAM: Product | null
  GPU: Product | null
  Storage: Product | null
  Cabinet: Product | null
  "Power Supply": Product | null
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Review {
  id: string
  name: string
  rating: number
  text: string
  date: string
  photo_count?: number
  review_count?: number
}

export interface StoreInfo {
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
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  delivery_address: string
  order_notes: string
  items: CartItem[]
  subtotal: number
  delivery_fee: number
  grand_total: number
  payment_id: string | null
  payment_status: string
  order_status: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  product_price: number
  quantity: number
  created_at: string
}

export interface OrderStatusLog {
  id: string
  order_id: string
  status: string
  note: string
  created_by: string
  created_at: string
}

export interface WishlistItem {
  id: string
  phone: string
  product_id: string
  created_at: string
}
