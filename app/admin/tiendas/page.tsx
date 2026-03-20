export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getStores } from '@/lib/supabase/queries'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { StoresTable } from './stores-table'

export default async function AdminTiendasPage() {
  const stores = await getStores()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tiendas</h1>
          <p className="text-muted-foreground">{stores.length} tiendas en total</p>
        </div>
        <Button asChild>
          <Link href="/admin/tiendas/new">
            <Plus className="h-4 w-4 mr-2" />
            Nueva tienda
          </Link>
        </Button>
      </div>
      <StoresTable stores={stores} />
    </div>
  )
}
