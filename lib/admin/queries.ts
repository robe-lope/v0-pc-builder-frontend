import { createAdminClient } from '@/lib/supabase/admin'
import type { AdminStats, AdminProfile, AdminPrice, CronLog } from './types'
import type { UserRole } from '@/lib/types'

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createAdminClient()

  const [products, stores, builds, cronLog] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('stores').select('id', { count: 'exact', head: true }),
    supabase.from('builds').select('id', { count: 'exact', head: true }),
    supabase
      .from('cron_logs')
      .select('started_at, status')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const { data: usersData } = await supabase.auth.admin.listUsers()

  return {
    productsCount: products.count ?? 0,
    storesCount: stores.count ?? 0,
    buildsCount: builds.count ?? 0,
    usersCount: usersData?.users?.length ?? 0,
    lastCronRun: cronLog.data?.started_at ?? null,
    lastCronStatus: cronLog.data?.status ?? null,
  }
}

export async function getAllProfiles(): Promise<AdminProfile[]> {
  const supabase = createAdminClient()

  const [{ data: profiles }, { data: usersData }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, role, updated_at').order('updated_at', { ascending: false }),
    supabase.auth.admin.listUsers(),
  ])

  const emailMap = new Map(
    (usersData?.users ?? []).map((u) => [u.id, { email: u.email ?? '', created_at: u.created_at }])
  )

  return (profiles ?? []).map((p) => ({
    id: p.id,
    email: emailMap.get(p.id)?.email ?? '',
    full_name: p.full_name,
    role: (p.role ?? 'user') as UserRole,
    created_at: emailMap.get(p.id)?.created_at ?? '',
  }))
}

export async function getAllPricesAdmin(): Promise<AdminPrice[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('product_prices')
    .select(`
      product_id, store_id, price, stock, updated_days_ago,
      products (name),
      stores (name)
    `)
    .order('product_id')

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    product_id: row.product_id,
    store_id: row.store_id,
    price: row.price,
    stock: row.stock,
    updated_days_ago: row.updated_days_ago,
    product_name: row.products?.name ?? '',
    store_name: row.stores?.name ?? '',
  }))
}

export async function getCronLogs(limit = 20): Promise<CronLog[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('cron_logs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as CronLog[]
}
