"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_ID = "8766033979"
const ADMIN_PASS = "Patil@1234"

export async function login(id: string, password: string) {
  if (id === ADMIN_ID && password === ADMIN_PASS) {
    const cookieStore = await cookies()
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/admin",
    })
    return { success: true }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_auth")
  redirect("/admin/login")
}

export async function checkAuth() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_auth")?.value === "true"
}
