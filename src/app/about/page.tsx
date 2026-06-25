import Image from "next/image"
import { storeInfo } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Store, Users, Award, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Hero */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              About{" "}
              <span className="text-cyan-400">MS Computer</span>
            </h1>
            <p className="text-zinc-400 mt-3 text-lg leading-relaxed">
              Your trusted computer hardware store in Sangola, Maharashtra —
              serving gamers, professionals, and businesses since our inception.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 items-center mb-16">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800">
            <Image
              src="/out-of-shop.png"
              alt="MS Computer Store"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white">
              Your Local Computer Expert
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Located at {storeInfo.address}, MS Computer is a premier destination
              for custom PC builds, laptops, computer components, CCTV cameras, and
              accessories. We cater to everyone from daily users to hardcore gamers
              and AI/LLM developers.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              We stock the latest brands including Intel, AMD, NVIDIA, Corsair, MSI,
              ASUS, and more. Our team provides expert advice to help you choose the
              right components for your needs and budget.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold text-white">{storeInfo.rating}</span>
              </div>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{storeInfo.reviewCount}+ reviews</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {[
            { icon: Store, label: "Products", value: "500+" },
            { icon: Users, label: "Happy Customers", value: "1000+" },
            { icon: Award, label: "Years Experience", value: "5+" },
            { icon: Shield, label: "Brands Available", value: "20+" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="bg-zinc-900/80 border-zinc-800 text-center py-6"
            >
              <CardContent>
                <stat.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white text-center">
            Why Choose MS Computer?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Genuine Products",
                desc: "100% authentic branded components with full warranty.",
              },
              {
                title: "Expert Guidance",
                desc: "Knowledgeable staff to help you build the perfect system.",
              },
              {
                title: "Competitive Pricing",
                desc: "Best prices in Sangola with regular deals and offers.",
              },
              {
                title: "Custom Builds",
                desc: "Tailored systems for gaming, video editing, and AI development.",
              },
              {
                title: "After-Sales Support",
                desc: "Reliable service and support after your purchase.",
              },
              {
                title: "Free Delivery",
                desc: "Complimentary local delivery in the Sangola area.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="bg-zinc-900/80 border-zinc-800 hover:border-cyan-500/30 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
