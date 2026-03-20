import { createAdminClient } from '@/lib/supabase/admin'
import type { UserRole } from '@/lib/types'

export async function adminUpsertProduct(product: {
  id?: string
  name: string
  category: string
  brand: string
  image: string
  specs: Record<string, string | number>
  socket?: string | null
  ram_type?: string | null
  ram_slots?: number | null
  max_ram_speed?: number | null
  form_factor?: string | null
  power_consumption?: number | null
  psu_wattage?: number | null
}) {
  const supabase = createAdminClient()
  const { id, ...rest } = product

  if (id) {
    const { error } = await supabase.from('products').update(rest).eq('id', id)
    if (error) throw error
    return id
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert(rest)
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }
}

export async function adminDeleteProduct(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function adminUpsertStore(store: {
  id?: string
  name: string
  location: string
  logo?: string
}) {
  const supabase = createAdminClient()
  const { id, ...rest } = store

  if (id) {
    const { error } = await supabase.from('stores').update(rest).eq('id', id)
    if (error) throw error
    return id
  } else {
    const { data, error } = await supabase
      .from('stores')
      .insert(rest)
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }
}

export async function adminDeleteStore(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('stores').delete().eq('id', id)
  if (error) throw error
}

export async function adminUpdatePrice(
  productId: string,
  storeId: string,
  price: number,
  stock: boolean
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('product_prices')
    .update({ price, stock, updated_days_ago: 0 })
    .eq('product_id', productId)
    .eq('store_id', storeId)
  if (error) throw error
}

export async function adminSetUserRole(userId: string, role: UserRole) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
  if (error) throw error
}

export async function adminCreateCronLog(
  jobName: string,
  triggeredBy: 'cron' | 'manual'
): Promise<string> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('cron_logs')
    .insert({
      job_name: jobName,
      triggered_by: triggeredBy,
      status: 'running',
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function adminFinishCronLog(
  logId: string,
  status: 'success' | 'error',
  message?: string
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('cron_logs')
    .update({
      status,
      message: message ?? null,
      finished_at: new Date().toISOString(),
    })
    .eq('id', logId)
  if (error) throw error
}
