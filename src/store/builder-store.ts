import { create } from "zustand"
import { Product, BuilderSelection, ComponentCategory } from "@/lib/types"


const mandatoryCategories: ComponentCategory[] = [
  "CPU", "Motherboard", "RAM", "GPU", "Storage", "Cabinet", "Power Supply",
]

interface BuilderStore {
  selection: BuilderSelection
  setComponent: (category: ComponentCategory, product: Product) => void
  removeComponent: (category: ComponentCategory) => void
  getTotal: () => number
  isComplete: () => boolean
  getMissingCategories: () => ComponentCategory[]
  reset: () => void
}

const initialSelection: BuilderSelection = {
  CPU: null,
  Motherboard: null,
  RAM: null,
  GPU: null,
  Storage: null,
  Cabinet: null,
  "Power Supply": null,
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  selection: { ...initialSelection },

  setComponent: (category, product) =>
    set((state) => ({
      selection: { ...state.selection, [category]: product },
    })),

  removeComponent: (category) =>
    set((state) => ({
      selection: { ...state.selection, [category]: null },
    })),

  getTotal: () => {
    const { selection } = get()
    return Object.values(selection).reduce(
      (total, product) => total + (product?.price ?? 0),
      0
    )
  },

  isComplete: () => {
    const { selection } = get()
    return mandatoryCategories.every((cat) => selection[cat] !== null)
  },

  getMissingCategories: () => {
    const { selection } = get()
    return mandatoryCategories.filter((cat) => selection[cat] === null)
  },

  reset: () => set({ selection: { ...initialSelection } }),
}))
