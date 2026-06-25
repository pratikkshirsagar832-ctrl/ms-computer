export interface Product {
  id: string
  name: string
  category: ComponentCategory
  description: string
  price: number
  image: string
  specs: string[]
  brand: string
  inStock: boolean
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
  photoCount?: number
  reviewCount?: number
}
