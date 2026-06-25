"use server"

import fs from "fs"
import path from "path"
import { storeInfo, products, reviews } from "@/lib/data"

const DATA_DIR = path.join(process.cwd(), "data")

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readJSON(filename: string) {
  ensureDir()
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) {
    const defaults: Record<string, unknown> = {
      "store-info.json": storeInfo,
      "products.json": products,
      "reviews.json": reviews,
    }
    const defaultData = defaults[filename]
    if (defaultData) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
    }
    return defaultData
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

function writeJSON(filename: string, data: unknown) {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2))
}

export async function getStoreInfo() {
  return readJSON("store-info.json") as typeof storeInfo
}

export async function updateStoreInfo(data: Partial<typeof storeInfo>) {
  const current = await getStoreInfo()
  const updated = { ...current, ...data }
  writeJSON("store-info.json", updated)
  return { success: true }
}

export async function getProducts() {
  return readJSON("products.json") as typeof products
}

export async function addProduct(product: (typeof products)[number]) {
  const current = await getProducts()
  current.push(product)
  writeJSON("products.json", current)
  return { success: true }
}

export async function updateProduct(id: string, data: Partial<(typeof products)[number]>) {
  const current = await getProducts()
  const index = current.findIndex((p) => p.id === id)
  if (index === -1) return { success: false, error: "Product not found" }
  current[index] = { ...current[index], ...data }
  writeJSON("products.json", current)
  return { success: true }
}

export async function deleteProduct(id: string) {
  const current = await getProducts()
  writeJSON("products.json", current.filter((p) => p.id !== id))
  return { success: true }
}

export async function getReviews() {
  return readJSON("reviews.json") as typeof reviews
}

export async function addReview(review: (typeof reviews)[number]) {
  const current = await getReviews()
  current.unshift(review)
  writeJSON("reviews.json", current)
  return { success: true }
}

export async function deleteReview(id: string) {
  const current = await getReviews()
  writeJSON("reviews.json", current.filter((r) => r.id !== id))
  return { success: true }
}
