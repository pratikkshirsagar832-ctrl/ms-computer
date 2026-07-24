"use client"

import { useState } from "react"
import { login } from "@/actions/admin"
import { Shield, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
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
      window.location.href = "/admin/dashboard"
    } else {
      setError(result.error || "Login failed")
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center relative overflow-hidden bg-background">
      <div className="w-full max-w-md mx-4">
        <div className="rounded-2xl shadow-2xl p-8 bg-card border border-border/40">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg mb-4 bg-primary">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm mt-1 text-muted-foreground">MS Computer — Sign in to manage</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                Admin ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter admin ID"
                className="w-full px-4 py-3 rounded-xl text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm rounded-xl px-4 py-3 bg-destructive/10 text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !id || !pass}
              className="w-full py-3 rounded-xl text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg bg-primary"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs mt-6 text-muted-foreground/60">
            Demo: ID <strong className="text-foreground">8766033979</strong> / Pass <strong className="text-foreground">Patil@1234</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
