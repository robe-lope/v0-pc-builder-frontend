"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Product, Store, ComponentCategory } from "@/lib/types"

const categoryLabels: Record<ComponentCategory, string> = {
  cpu: "Procesadores",
  motherboard: "Motherboards",
  gpu: "Placas de Video",
  ram: "Memoria RAM",
  storage: "Almacenamiento",
  psu: "Fuentes",
  case: "Gabinetes",
  cooler: "Coolers",
  other: "Otros",
}

interface CatalogContentProps {
  initialProducts: Product[]
  initialStores: Store[]
}

export function CatalogContent({ initialProducts, initialStores }: CatalogContentProps) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || ""
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000])
  const [sortBy, setSortBy] = useState("price-asc")

  const brands = useMemo(() => {
    const brandSet = new Set(initialProducts.map((p) => p.brand))
    return Array.from(brandSet).sort()
  }, [initialProducts])

  const filteredProducts = useMemo(() => {
    const filtered = initialProducts.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false

      const lowestPrice = Math.min(...product.prices.map((p) => p.price))
      if (lowestPrice < priceRange[0] || lowestPrice > priceRange[1]) return false

      if (selectedStores.length > 0) {
        const hasStore = product.prices.some((p) => selectedStores.includes(p.storeId))
        if (!hasStore) return false
      }

      return true
    })

    filtered.sort((a, b) => {
      const aPrice = Math.min(...a.prices.map((p) => p.price))
      const bPrice = Math.min(...b.prices.map((p) => p.price))
      switch (sortBy) {
        case "price-asc": return aPrice - bPrice
        case "price-desc": return bPrice - aPrice
        case "name": return a.name.localeCompare(b.name)
        default: return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategories, selectedBrands, selectedStores, priceRange, sortBy, initialProducts])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const toggleStore = (storeId: string) => {
    setSelectedStores((prev) => (prev.includes(storeId) ? prev.filter((s) => s !== storeId) : [...prev, storeId]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedStores([])
    setPriceRange([0, 2000000])
    setSearchQuery("")
  }

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Búsqueda</Label>
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Categoría</Label>
        <div className="space-y-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${key}`}
                checked={selectedCategories.includes(key)}
                onCheckedChange={() => toggleCategory(key)}
              />
              <label htmlFor={`cat-${key}`} className="text-sm cursor-pointer">{label}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Marca</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">{brand}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Tienda</Label>
        <div className="space-y-2">
          {initialStores.map((store) => (
            <div key={store.id} className="flex items-center space-x-2">
              <Checkbox
                id={`store-${store.id}`}
                checked={selectedStores.includes(store.id)}
                onCheckedChange={() => toggleStore(store.id)}
              />
              <label htmlFor={`store-${store.id}`} className="text-sm cursor-pointer">{store.name}</label>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Limpiar filtros
      </Button>
    </div>
  )

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Catálogo de hardware</h1>
        <p className="text-muted-foreground mt-2">Explorá y compará precios de componentes</p>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h2 className="font-semibold">Filtros</h2>
                </div>
                <FilterSection />
              </CardContent>
            </Card>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 gap-4">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <Label htmlFor="sort" className="text-sm whitespace-nowrap">Ordenar:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Precio: Menor a mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a menor</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {filteredProducts.length} {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const lowestPrice = Math.min(...product.prices.map((p) => p.price))
              const stockCount = product.prices.filter((p) => p.stock).length

              return (
                <Link key={product.id} href={`/producto/${product.id}`}>
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="aspect-square relative mb-4 bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
                        <h3 className="font-semibold text-pretty line-clamp-2 leading-snug">{product.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-primary">${lowestPrice.toLocaleString("es-AR")}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Disponible en {stockCount} {stockCount === 1 ? "tienda" : "tiendas"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron productos con los filtros seleccionados</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
