import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/require-admin'
import { adminSetUserRole } from '@/lib/admin/mutations'
import type { UserRole } from '@/lib/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminApi()
  if (guard) return guard

  try {
    const { id } = await params
    const { role } = await req.json()
    await adminSetUserRole(id, role as UserRole)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
