export const dynamic = 'force-dynamic'

import { getAllPricesAdmin } from '@/lib/admin/queries'
import { PricesTable } from './prices-table'

export default async function AdminPreciosPage() {
  const prices = await getAllPricesAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Precios</h1>
        <p className="text-muted-foreground">{prices.length} registros de precios</p>
      </div>
      <PricesTable prices={prices} />
    </div>
  )
}
