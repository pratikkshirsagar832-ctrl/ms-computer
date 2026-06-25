"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/actions/admin"
import Lightfall from "@/components/admin/Lightfall"
import { Shield, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [id, setId] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(id, pass)
    setLoading(false)
    if (result.success) {
      router.push("/admin/dashboard")
    } else {
      setError(result.error || "Login failed")
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#F5F5F5" }}>
      <Lightfall
        colors={["#408EC6", "#0A1128", "#7AB8E0"]}
        backgroundColor="#F5F5F5"
        speed={0.8}
        density={0.3}
        opacity={0.35}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-3xl shadow-2xl p-8" style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(64, 142, 198, 0.15)" }}>
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg mb-4" style={{ backgroundColor: "#0A1128" }}>
              <Shield className="h-8 w-8" style={{ color: "#408EC6" }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#0A1128" }}>Admin Panel</h1>
            <p className="text-sm mt-1" style={{ color: "#0A1128", opacity: 0.6 }}>MS Computer — Sign in to manage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A1128" }}>
                Admin ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter admin ID"
                className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-gray-400 transition-all outline-none"
                style={{ border: "1px solid #d0d0d0", backgroundColor: "#F5F5F5", color: "#0A1128" }}
                onFocus={(e) => e.target.style.borderColor = "#408EC6"}
                onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#0A1128" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm placeholder:text-gray-400 transition-all outline-none"
                  style={{ border: "1px solid #d0d0d0", backgroundColor: "#F5F5F5", color: "#0A1128" }}
                  onFocus={(e) => e.target.style.borderColor = "#408EC6"}
                  onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#0A1128", opacity: 0.4 }}
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(10, 17, 40, 0.05)", color: "#0A1128", border: "1px solid rgba(10, 17, 40, 0.1)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !id || !pass}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              style={{ backgroundColor: "#408EC6" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#0A1128", opacity: 0.4 }}>
            Demo: ID <strong>8766033979</strong> / Pass <strong>Patil@1234</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
