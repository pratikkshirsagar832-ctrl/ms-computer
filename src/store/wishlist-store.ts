"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistState {
  items: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId: string) => {
        const exists = get().items.includes(productId)
        set({
          items: exists
            ? get().items.filter((id) => id !== productId)
            : [...get().items, productId],
        })
      },
      has: (productId: string) => get().items.includes(productId),
      clear: () => set({ items: [] }),
    }),
    { name: "ms-wishlist" }
  )
)
