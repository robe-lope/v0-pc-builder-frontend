import { notFound } from "next/navigation"
import { getProductById, getStores } from "@/lib/supabase/queries"
import { ProductoContent } from "./producto-content"

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, stores] = await Promise.all([getProductById(id), getStores()])

  if (!product) {
    notFound()
  }

  return <ProductoContent product={product} stores={stores} />
}
