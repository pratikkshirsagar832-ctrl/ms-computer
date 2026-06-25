import { redirect } from "next/navigation"
import { checkAuth } from "@/actions/admin"

export default async function AdminPage() {
  const isAuth = await checkAuth()
  if (isAuth) {
    redirect("/admin/dashboard")
  }
  redirect("/admin/login")
}
