export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getProducts } from '@/lib/supabase/queries'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductsTable } from './products-table'

export default async function AdminProductosPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground">{products.length} productos en total</p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo producto
          </Link>
        </Button>
      </div>
      <ProductsTable products={products} />
    </div>
  )
}
