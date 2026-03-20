import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/require-admin'
import { adminUpdatePrice } from '@/lib/admin/mutations'

export async function PATCH(req: NextRequest) {
  const guard = await requireAdminApi()
  if (guard) return guard

  try {
    const { productId, storeId, price, stock } = await req.json()
    await adminUpdatePrice(productId, storeId, price, stock)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
