"use client"

import Link from "next/link"
import Image from "next/image"
import { Plus, Trash2, AlertTriangle, AlertCircle, Info, Share2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useBuildComponents, useBuildWarnings, useBuildActions, useBuildTotals } from "@/lib/store"
import { mockStores } from "@/lib/mock-data"
import type { ComponentCategory } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

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

const categoryOrder: ComponentCategory[] = [
  "cpu",
  "motherboard",
  "gpu",
  "ram",
  "storage",
  "psu",
  "case",
  "cooler",
  "other",
]

export default function BuildPage() {
  const components = useBuildComponents()
  const warnings = useBuildWarnings()
  const { removeComponent, clearBuild } = useBuildActions()
  const { totalsByStore, grandTotal, bestPricePerComponent } = useBuildTotals()
  const { toast } = useToast()

  const handleShare = () => {
    toast({
      title: "Compartir build",
      description: "Esta función estará disponible próximamente",
    })
  }

  const handleSave = () => {
    toast({
      title: "Build guardado",
      description: "Tu build se guardó correctamente",
    })
  }

  const hasComponents = components.some((c) => c.product !== null)

  // Group components by category, respecting the order
  const orderedComponents = categoryOrder.map((category) => {
    const matches = components.filter((c) => c.category === category)
    return matches.length > 0 ? matches : [{ category, product: null, quantity: 0 }]
  })

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Armá tu PC</h1>
          <p className="text-muted-foreground mt-1">Seleccioná los componentes para tu build ideal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          {hasComponents && (
            <Button variant="destructive" onClick={clearBuild}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar todo
            </Button>
          )}
        </div>
      </div>

      {/* Warnings */}
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
        {/* Components List */}
        <div className="lg:col-span-2 space-y-4">
          {orderedComponents.map((componentGroup, groupIndex) => {
            const firstComponent = componentGroup[0]
            const category = firstComponent.category
            const label = categoryLabels[category]

            return (
              <Card key={`${category}-${groupIndex}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {componentGroup.map((component, index) => {
                    if (!component.product) {
                      return (
                        <Link key={`empty-${category}-${index}`} href={`/catalogo?category=${category}`}>
                          <div className="flex items-center justify-between p-4 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <p className="text-muted-foreground">Seleccionar {label.toLowerCase()}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Agregar
                            </Button>
                          </div>
                        </Link>
                      )
                    }

                    const bestPrice = bestPricePerComponent[component.product.id]
                    const store = bestPrice ? mockStores.find((s) => s.id === bestPrice.storeId) : null

                    return (
                      <div
                        key={`${component.product.id}-${index}`}
                        className={index > 0 ? "mt-3 pt-3 border-t border-border/50" : ""}
                      >
                        <div className="flex gap-4">
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
                            <Image
                              src={component.product.image || "/placeholder.svg"}
                              alt={component.product.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link href={`/producto/${component.product.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 text-pretty">
                                {component.product.name}
                              </h3>
                            </Link>
                            {store && bestPrice && (
                              <div className="mt-1 flex items-center gap-2 flex-wrap">
                                <p className="text-lg font-bold text-primary">
                                  ${bestPrice.price.toLocaleString("es-AR")}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {store.name}
                                </Badge>
                              </div>
                            )}
                            {component.quantity > 1 && (
                              <p className="text-sm text-muted-foreground mt-1">Cantidad: {component.quantity}</p>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeComponent(category, component.product!.id)}
                            className="flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de precios</CardTitle>
              </CardHeader>
              <CardContent>
                {hasComponents ? (
                  <div className="space-y-4">
                    {Object.keys(totalsByStore).length > 0 && (
                      <>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground mb-3">Por tienda</p>
                          {Object.entries(totalsByStore).map(([storeId, total]) => {
                            const store = mockStores.find((s) => s.id === storeId)
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

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Los precios pueden variar. Verificá la disponibilidad antes de comprar.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Agregá componentes para ver el resumen de precios
                  </p>
                )}
              </CardContent>
            </Card>

            {hasComponents && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Compatibilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  {warnings.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
                      <span>Sin problemas detectados</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {warnings.map((warning, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          {warning.type === "error" ? (
                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span className="text-xs">{warning.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
