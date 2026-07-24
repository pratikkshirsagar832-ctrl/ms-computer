"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_ID = process.env.ADMIN_ID || "8766033979"
const ADMIN_PASS = process.env.ADMIN_PASS || "Patil@1234"

export async function login(id: string, password: string) {
  if (id !== ADMIN_ID || password !== ADMIN_PASS) {
    return { success: false, error: "Invalid credentials" }
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  })

  return { success: true }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_auth")
  redirect("/admin/login")
}

export async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get("admin_auth")
  return auth?.value === "true"
}
