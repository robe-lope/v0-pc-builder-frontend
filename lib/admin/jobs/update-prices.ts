import { createAdminClient } from '@/lib/supabase/admin'
import { adminCreateCronLog, adminFinishCronLog } from '@/lib/admin/mutations'

export async function runUpdatePricesJob(triggeredBy: 'cron' | 'manual') {
  const logId = await adminCreateCronLog('update-prices', triggeredBy)

  try {
    const supabase = createAdminClient()

    // Fetch all prices
    const { data: prices, error } = await supabase
      .from('product_prices')
      .select('product_id, store_id, price, updated_days_ago')

    if (error) throw error

    // Apply updates: increment updated_days_ago + ±3% price fluctuation
    const updates = (prices ?? []).map((row) => {
      const fluctuation = 1 + (Math.random() * 0.06 - 0.03) // ±3%
      const newPrice = Math.round(row.price * fluctuation)
      return {
        product_id: row.product_id,
        store_id: row.store_id,
        price: newPrice,
        updated_days_ago: row.updated_days_ago + 1,
      }
    })

    // Upsert all price rows
    const { error: upsertError } = await supabase
      .from('product_prices')
      .upsert(updates, { onConflict: 'product_id,store_id' })

    if (upsertError) throw upsertError

    await adminFinishCronLog(logId, 'success', `Updated ${updates.length} prices`)
    return { success: true, updated: updates.length }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await adminFinishCronLog(logId, 'error', message)
    throw err
  }
}
