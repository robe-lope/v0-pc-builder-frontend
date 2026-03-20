import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/require-admin'
import { runUpdatePricesJob } from '@/lib/admin/jobs/update-prices'

export async function POST() {
  const guard = await requireAdminApi()
  if (guard) return guard

  try {
    const result = await runUpdatePricesJob('manual')
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
