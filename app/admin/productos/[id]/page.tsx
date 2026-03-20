export const dynamic = 'force-dynamic'

import { getProductById } from '@/lib/supabase/queries'
import { getStores } from '@/lib/supabase/queries'
import { ProductForm } from './product-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProductoEditPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  const [product, stores] = await Promise.all([
    isNew ? Promise.resolve(null) : getProductById(id),
    getStores(),
  ])

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">
          {isNew ? 'Nuevo producto' : 'Editar producto'}
        </h1>
      </div>
      <ProductForm product={product} stores={stores} />
    </div>
  )
}
