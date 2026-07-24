"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getStoreInfo, submitContactMessage } from "@/actions/data"
import type { StoreInfo } from "@/lib/types"
import { FadeInView } from "@/components/ui/fade-in-view"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Loader2,
  MessageSquare,
} from "lucide-react"

export default function ContactPage() {
  const [store, setStore] = useState<StoreInfo | null>(null)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", message: "" })

  useEffect(() => {
    getStoreInfo().then(setStore)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) return
    setSending(true)
    const result = await submitContactMessage(form)
    setSending(false)
    if (result.success) {
      setSent(true)
    }
  }

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="relative border-b border-border/40 bg-card/30 overflow-hidden">
        <div className="hero-orb hero-orb-accent w-[350px] h-[350px] -top-40 right-10 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="section-tag">Get In Touch</span>
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">
            Contact Us
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Visit our store, call, or send a message — we&apos;d love to help
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact info */}
          <FadeInView><div className="space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Visit Our Store
              </h2>
              <p className="text-muted-foreground">
                Drop by our store in Sangola for personalized service and expert advice.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: "Address", value: store?.address, href: store?.map_link },
                { icon: Phone, label: "Phone", value: store?.phone, href: `tel:${store?.phone}` },
                { icon: Mail, label: "Email", value: store?.email, href: `mailto:${store?.email}` },
                { icon: Clock, label: "Business Hours", value: store?.hours },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/15 transition-all duration-300 shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-foreground font-medium hover:text-primary transition-colors"
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="aspect-video rounded-2xl bg-card border border-border/40 flex items-center justify-center overflow-hidden">
              <div className="text-center p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/10 mx-auto mb-4">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{store?.address}</p>
                <a
                  href={store?.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 mt-2 inline-flex items-center gap-1 font-medium"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div></FadeInView>

          {/* Contact form */}
          <FadeInView delay={100}><div className="rounded-2xl border border-border/40 bg-card p-8 shadow-xl">
            {sent ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-emerald-400" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  className="mt-8 rounded-full"
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
                <h2 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Your Name *
                    </label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Phone Number *
                    </label>
                    <Input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Your Message *
                    </label>
                    <Textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us what you need — custom PC build, upgrade, repair..."
                      className="min-h-[140px] rounded-xl border-white/10 bg-card/50 focus:border-primary/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
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
          </FadeInView>
        </div>
      </div>
    </div>
  )
}
