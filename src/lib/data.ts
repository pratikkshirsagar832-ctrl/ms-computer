import {
  Laptop, Monitor, Gamepad2, Radio, Keyboard, Wifi,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface CategoryItem {
  name: string
  icon: LucideIcon
  href: string
}

export const categories: CategoryItem[] = [
  { name: "Laptop", icon: Laptop, href: "/products?category=Laptop" },
  { name: "Desktop", icon: Monitor, href: "/products?category=Desktop" },
  { name: "Gaming PC", icon: Gamepad2, href: "/products?category=Gaming PC" },
  { name: "CCTV Camera", icon: Radio, href: "/products?category=CCTV Camera" },
  { name: "Accessories", icon: Keyboard, href: "/products?category=Accessories" },
  { name: "Networking", icon: Wifi, href: "/products?category=Networking" },
]

export const categoryIcons: Record<string, LucideIcon> = {
  Laptop: Laptop,
  Desktop: Monitor,
  "Gaming PC": Gamepad2,
  "CCTV Camera": Radio,
  Accessories: Keyboard,
  Networking: Wifi,
}

export const adminCredentials = {
  id: "8766033979",
  password: "Patil@1234",
}
