import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/require-admin'
import { adminUpsertProduct, adminDeleteProduct } from '@/lib/admin/mutations'

export async function POST(req: NextRequest) {
  const guard = await requireAdminApi()
  if (guard) return guard

  try {
    const body = await req.json()
    const id = await adminUpsertProduct(body)
    return NextResponse.json({ id })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdminApi()
  if (guard) return guard

  try {
    const { id } = await req.json()
    await adminDeleteProduct(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
