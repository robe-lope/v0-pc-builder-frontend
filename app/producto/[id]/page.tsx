"use client"

import { use } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Clock, Package, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockProducts, mockStores } from "@/lib/mock-data"
import { useBuildActions } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { addComponent } = useBuildActions()

  const product = mockProducts.find((p) => p.id === resolvedParams.id)

  if (!product) {
    notFound()
  }

  const handleAddToBuild = () => {
    addComponent(product.category, product)
    toast({
      title: "Componente agregado",
      description: `${product.name} se agregó a tu build`,
    })
    router.push("/build")
  }

  // Sort prices by lowest first
  const sortedPrices = [...product.prices].filter((p) => p.stock).sort((a, b) => a.price - b.price)

  const outOfStockPrices = product.prices.filter((p) => !p.stock)

  const lowestPrice = sortedPrices[0]

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div>
          <div className="aspect-square relative bg-muted rounded-xl overflow-hidden">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-8" />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.brand}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-balance">{product.name}</h1>

            {lowestPrice && (
              <div className="flex items-baseline gap-3 mb-4">
                <p className="text-4xl font-bold text-primary">${lowestPrice.price.toLocaleString("es-AR")}</p>
                <p className="text-sm text-muted-foreground">precio más bajo</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Package className="h-4 w-4" />
              <span>
                Disponible en {sortedPrices.length} {sortedPrices.length === 1 ? "tienda" : "tiendas"}
              </span>
            </div>

            <Button size="lg" onClick={handleAddToBuild} className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Agregar al build
            </Button>
          </div>

          <Separator />

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <dt className="font-medium capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</dt>
                    <dd className="text-right font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comparación de precios</h2>

        <div className="space-y-3">
          {sortedPrices.map((price, index) => {
            const store = mockStores.find((s) => s.id === price.storeId)
            if (!store) return null

            return (
              <Card key={price.storeId} className={index === 0 ? "border-primary shadow-sm" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{store.name}</h3>
                          {index === 0 && (
                            <Badge variant="default" className="text-xs">
                              Mejor precio
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{store.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold">${price.price.toLocaleString("es-AR")}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>Actualizado hace {price.updatedDaysAgo}d</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" asChild>
                        <Link href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver en tienda
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {outOfStockPrices.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mt-8 mb-4 text-muted-foreground">Sin stock</h3>
              {outOfStockPrices.map((price) => {
                const store = mockStores.find((s) => s.id === price.storeId)
                if (!store) return null

                return (
                  <Card key={price.storeId} className="opacity-60">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{store.name}</h3>
                          <p className="text-sm text-muted-foreground">{store.location}</p>
                        </div>
                        <Badge variant="secondary">Sin stock</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
