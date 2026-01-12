import { MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockStores } from "@/lib/mock-data"
import Link from "next/link"

export default function TiendasPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Tiendas</h1>
        <p className="text-muted-foreground mt-2">Conocé las tiendas donde podés comprar tus componentes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{store.name}</span>
                <Badge variant="secondary">Online</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{store.location}</span>
                </div>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/catalogo?stores=${store.id}`}>Ver productos</Link>
                </Button>

                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visitar sitio web
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
        <h2 className="text-xl font-semibold mb-3">Acerca de los precios</h2>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>
            Los precios mostrados son aproximados y pueden variar. Te recomendamos verificar la disponibilidad y el
            precio final en el sitio de cada tienda antes de realizar tu compra.
          </p>
          <p>
            Los datos se actualizan regularmente, pero pueden tener algunos días de diferencia con los precios reales.
          </p>
        </div>
      </div>
    </div>
  )
}
