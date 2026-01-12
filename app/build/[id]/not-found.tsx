import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-3xl font-bold mb-4">Build no encontrado</h2>
      <p className="text-muted-foreground mb-6">El build que buscás no existe o fue eliminado</p>
      <Link href="/perfil">
        <Button>Ver mis builds</Button>
      </Link>
    </div>
  )
}
