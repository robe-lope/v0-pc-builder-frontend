import Link from "next/link"
import { Cpu } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Cpu className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">PCBuilder</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Armá tu PC ideal con los mejores precios de Argentina
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Navegación</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-foreground transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/build" className="hover:text-foreground transition-colors">
                  Armá tu PC
                </Link>
              </li>
              <li>
                <Link href="/tiendas" className="hover:text-foreground transition-colors">
                  Tiendas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 PCBuilder. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
