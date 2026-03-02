"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Share2, AlertTriangle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { checkCompatibility, calculateBuildPrice } from "@/lib/compatibility"
import { useToast } from "@/hooks/use-toast"
import type { Build, Store, ComponentCategory } from "@/lib/types"

const categoryLabels: Record<ComponentCategory, string> = {
  cpu: "Procesador",
  motherboard: "Motherboard",
  gpu: "Placa de Video",
  ram: "Memoria RAM",
  storage: "Almacenamiento",
  psu: "Fuente",
  case: "Gabinete",
  cooler: "Cooler",
  other: "Otros",
}

interface BuildViewProps {
  build: Build
  stores: Store[]
}

export function BuildView({ build, stores }: BuildViewProps) {
  const { toast } = useToast()

  const warnings = checkCompatibility(build.components)
  const { totalsByStore, grandTotal, bestPricePerComponent } = calculateBuildPrice(build.components)

  const handleShare = () => {
    toast({ title: "Enlace copiado", description: "El enlace del build se copió al portapapeles" })
  }

  return (
    <div className="container py-8">
      <Link href="/perfil">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a mis builds
        </Button>
      </Link>

      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{build.name}</h1>
          <p className="text-muted-foreground mt-1">
            Creado el {build.createdAt.toLocaleDateString("es-AR", { dateStyle: "long" })}
          </p>
        </div>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>

      {warnings.length > 0 && (
        <div className="mb-6 space-y-3">
          {warnings.map((warning, index) => (
            <Alert key={index} variant={warning.type === "error" ? "destructive" : "default"}>
              {warning.type === "error" ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>{warning.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {build.components
            .filter((c) => c.product !== null)
            .map((component) => {
              if (!component.product) return null

              const bestPrice = bestPricePerComponent[component.product.id]
              const store = bestPrice ? stores.find((s) => s.id === bestPrice.storeId) : null

              return (
                <Card key={component.product.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
                        <Image
                          src={component.product.image || "/placeholder.svg"}
                          alt={component.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2">
                          {categoryLabels[component.category]}
                        </Badge>
                        <Link href={`/producto/${component.product.id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors text-pretty">
                            {component.product.name}
                          </h3>
                        </Link>
                        {store && bestPrice && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <p className="text-xl font-bold text-primary">${bestPrice.price.toLocaleString("es-AR")}</p>
                            <span className="text-sm text-muted-foreground">en {store.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de precios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.keys(totalsByStore).length > 0 && (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground mb-3">Por tienda</p>
                        {Object.entries(totalsByStore).map(([storeId, total]) => {
                          const store = stores.find((s) => s.id === storeId)
                          if (!store) return null
                          return (
                            <div key={storeId} className="flex justify-between items-center">
                              <span className="text-sm">{store.name}</span>
                              <span className="font-semibold">${total.toLocaleString("es-AR")}</span>
                            </div>
                          )
                        })}
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">${grandTotal.toLocaleString("es-AR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
