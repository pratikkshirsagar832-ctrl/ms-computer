"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { storeInfo } from "@/lib/data"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) return
    setSending(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="border-b border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="text-zinc-400 mt-2">
            Get in touch — visit our store, call, or send a message
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Visit Our Store
              </h2>
              <p className="text-zinc-400">
                We&apos;d love to help you build your dream PC. Drop by or reach
                out.
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value: storeInfo.address,
                  href: storeInfo.mapLink,
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: storeInfo.phone,
                  href: `tel:${storeInfo.phone}`,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: storeInfo.email,
                  href: `mailto:${storeInfo.email}`,
                },
                {
                  icon: Clock,
                  label: "Hours",
                  value: storeInfo.hours,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 shrink-0">
                    <item.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-cyan-400 transition-colors"
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="aspect-video rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">{storeInfo.address}</p>
                <a
                  href={storeInfo.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 inline-block"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">Message Sent!</h3>
                <p className="text-zinc-400 mt-2">
                  We&apos;ll get back to you shortly.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-zinc-700 text-zinc-300"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: "", phone: "", message: "" })
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-white mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm text-zinc-400 mb-1.5 block">
                      Your Name *
                    </label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-1.5 block">
                      Phone Number *
                    </label>
                    <Input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-1.5 block">
                      Message *
                    </label>
                    <Textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what you need..."
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 placeholder:text-zinc-600 min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold h-12 disabled:opacity-50"
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
