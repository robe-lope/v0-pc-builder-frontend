import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getAdminStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, isAdmin: false }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return { user, isAdmin: profile?.role === 'admin' }
}

/** Use in Server Components / page.tsx: redirects if not admin */
export async function requireAdminPage() {
  const { user, isAdmin } = await getAdminStatus()
  if (!user) redirect('/auth/login')
  if (!isAdmin) redirect('/')
}

/** Use in API Route handlers: returns error NextResponse if not admin */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const { user, isAdmin } = await getAdminStatus()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
