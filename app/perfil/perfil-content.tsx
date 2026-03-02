"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { calculateBuildPrice } from "@/lib/compatibility"
import type { Build } from "@/lib/types"

interface PerfilContentProps {
  fullName: string
  email: string
  builds: Build[]
}

export function PerfilContent({ fullName, email, builds }: PerfilContentProps) {
  return (
    <div className="container py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{fullName}</h1>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Builds</h2>
          <p className="text-muted-foreground mt-1">Tus configuraciones guardadas</p>
        </div>
        <Link href="/build">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Build
          </Button>
        </Link>
      </div>

      {builds.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => {
            const { grandTotal } = calculateBuildPrice(build.components)
            const componentCount = build.components.filter((c) => c.product !== null).length

            return (
              <Link key={build.id} href={`/build/${build.id}`}>
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-lg text-balance">{build.name}</span>
                      <Badge variant="secondary">{componentCount} componentes</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2">
                        {build.components
                          .filter((c) => c.product !== null)
                          .slice(0, 4)
                          .map((component, index) => (
                            <div
                              key={`${component.product?.id}-${index}`}
                              className="aspect-square relative bg-muted rounded-md overflow-hidden"
                            >
                              <Image
                                src={component.product?.image || "/placeholder.svg"}
                                alt={component.product?.name || ""}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{build.createdAt.toLocaleDateString("es-AR")}</span>
                        </div>
                        <p className="text-lg font-bold text-primary">${grandTotal.toLocaleString("es-AR")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Aún no tenés builds guardados</p>
            <Link href="/build">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear mi primer build
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
