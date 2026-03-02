import { createClient } from '@supabase/supabase-js'
import { mockProducts, mockStores } from '../lib/mock-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedStores() {
  const rows = mockStores.map((s) => ({
    id: s.id,
    name: s.name,
    location: s.location,
    logo: s.logo ?? null,
  }))

  const { error } = await supabase.from('stores').upsert(rows, { onConflict: 'id' })
  if (error) throw error
  console.log(`✓ Seeded ${rows.length} stores`)
}

async function seedProducts() {
  const productRows = mockProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    brand: p.brand,
    image: p.image,
    specs: p.specs,
    socket: p.socket ?? null,
    ram_type: p.ramType ?? null,
    ram_slots: p.ramSlots ?? null,
    max_ram_speed: p.maxRamSpeed ?? null,
    form_factor: p.formFactor ?? null,
    power_consumption: p.powerConsumption ?? null,
    psu_wattage: p.psuWattage ?? null,
  }))

  const { error: prodError } = await supabase
    .from('products')
    .upsert(productRows, { onConflict: 'id' })
  if (prodError) throw prodError
  console.log(`✓ Seeded ${productRows.length} products`)

  const priceRows = mockProducts.flatMap((p) =>
    p.prices.map((price) => ({
      product_id: p.id,
      store_id: price.storeId,
      price: price.price,
      stock: price.stock,
      updated_days_ago: price.updatedDaysAgo,
    }))
  )

  const { error: priceError } = await supabase
    .from('product_prices')
    .upsert(priceRows, { onConflict: 'product_id,store_id' })
  if (priceError) throw priceError
  console.log(`✓ Seeded ${priceRows.length} prices`)
}

async function main() {
  console.log('Starting seed...')
  await seedStores()
  await seedProducts()
  console.log('Seed complete!')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
