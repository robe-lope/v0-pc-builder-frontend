import { Suspense } from "react"
import { getProducts, getStores } from "@/lib/supabase/queries"
import { CatalogContent } from "./catalog-content"

export default async function CatalogoPage() {
  const [products, stores] = await Promise.all([getProducts(), getStores()])

  return (
    <Suspense fallback={null}>
      <CatalogContent initialProducts={products} initialStores={stores} />
    </Suspense>
  )
}
