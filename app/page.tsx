"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Cpu, MonitorSmartphone, Zap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const categories: { name: string; label: string; icon: typeof Cpu; color: string }[] = [
  { name: "cpu", label: "Procesadores", icon: Cpu, color: "bg-blue-500" },
  { name: "gpu", label: "Placas de Video", icon: MonitorSmartphone, color: "bg-purple-500" },
  { name: "motherboard", label: "Motherboards", icon: Cpu, color: "bg-green-500" },
  { name: "ram", label: "Memoria RAM", icon: Zap, color: "bg-yellow-500" },
  { name: "storage", label: "Almacenamiento", icon: ShieldCheck, color: "bg-red-500" },
  { name: "psu", label: "Fuentes", icon: Zap, color: "bg-orange-500" },
]

const features = [
  {
    title: "Comparación de precios",
    description: "Encontrá los mejores precios en todas las tiendas de Argentina",
    icon: Search,
  },
  {
    title: "Validación de compatibilidad",
    description: "Te avisamos si los componentes no son compatibles",
    icon: ShieldCheck,
  },
  {
    title: "Armados guardados",
    description: "Guardá tus builds y compartílas con quien quieras",
    icon: Cpu,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
            Armá tu PC ideal con los mejores precios
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance leading-relaxed md:text-xl">
            Compará precios en todas las tiendas de Argentina y armá tu PC con validación de compatibilidad en tiempo
            real
          </p>

          <form onSubmit={handleSearch} className="mt-10 mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar componentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base"
              />
            </div>
            <div className="mt-4 flex gap-3 justify-center">
              <Link href="/catalogo">
                <Button variant="outline" size="lg">
                  Ver catálogo
                </Button>
              </Link>
              <Link href="/build">
                <Button size="lg">
                  Armar PC <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Explorá por categoría</h2>
            <p className="mt-4 text-muted-foreground text-pretty">Encontrá los mejores componentes para tu build</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link key={category.name} href={`/catalogo?category=${category.name}`} className="group">
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <div className={`mb-3 rounded-xl ${category.color} p-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {category.label}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Por qué PCBuilder</h2>
          <p className="mt-4 text-muted-foreground text-pretty">La forma más fácil de armar tu PC perfecta</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-border/40">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Empezá a armar tu PC ahora</h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Es gratis, fácil y con los mejores precios del mercado
            </p>
            <div className="mt-8">
              <Link href="/build">
                <Button size="lg" className="h-12 px-8">
                  Comenzar <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
