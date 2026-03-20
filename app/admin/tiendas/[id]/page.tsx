export const dynamic = 'force-dynamic'

import { getStores } from '@/lib/supabase/queries'
import { StoreForm } from './store-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminTiendaEditPage({ params }: Props) {
  const { id } = await params
  const isNew = id === 'new'

  let store = null
  if (!isNew) {
    const stores = await getStores()
    store = stores.find((s) => s.id === id) ?? null
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold">
          {isNew ? 'Nueva tienda' : 'Editar tienda'}
        </h1>
      </div>
      <StoreForm store={store} />
    </div>
  )
}
