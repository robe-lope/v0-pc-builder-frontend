import { createClient } from './server'
import type { Product, ProductPrice, Store, Build, BuildComponent } from '@/lib/types'

function mapPrice(row: {
  store_id: string
  price: number
  stock: boolean
  updated_days_ago: number
}): ProductPrice {
  return {
    storeId: row.store_id,
    price: row.price,
    stock: row.stock,
    updatedDaysAgo: row.updated_days_ago,
  }
}

function mapProduct(
  row: {
    id: string
    name: string
    category: string
    brand: string
    image: string
    socket: string | null
    ram_type: string | null
    ram_slots: number | null
    max_ram_speed: number | null
    form_factor: string | null
    power_consumption: number | null
    psu_wattage: number | null
    specs: Record<string, string | number>
  },
  prices: ProductPrice[]
): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Product['category'],
    brand: row.brand,
    image: row.image,
    specs: row.specs,
    prices,
    ...(row.socket ? { socket: row.socket as Product['socket'] } : {}),
    ...(row.ram_type ? { ramType: row.ram_type as Product['ramType'] } : {}),
    ...(row.ram_slots != null ? { ramSlots: row.ram_slots } : {}),
    ...(row.max_ram_speed != null ? { maxRamSpeed: row.max_ram_speed } : {}),
    ...(row.form_factor ? { formFactor: row.form_factor as Product['formFactor'] } : {}),
    ...(row.power_consumption != null ? { powerConsumption: row.power_consumption } : {}),
    ...(row.psu_wattage != null ? { psuWattage: row.psu_wattage } : {}),
  }
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id, name, category, brand, image, socket, ram_type, ram_slots,
      max_ram_speed, form_factor, power_consumption, psu_wattage, specs,
      product_prices (store_id, price, stock, updated_days_ago)
    `)

  if (error) throw error

  return (products ?? []).map((p) =>
    mapProduct(p, (p.product_prices ?? []).map(mapPrice))
  )
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, category, brand, image, socket, ram_type, ram_slots,
      max_ram_speed, form_factor, power_consumption, psu_wattage, specs,
      product_prices (store_id, price, stock, updated_days_ago)
    `)
    .eq('id', id)
    .single()

  if (error) return null

  return mapProduct(data, (data.product_prices ?? []).map(mapPrice))
}

export async function getStores(): Promise<Store[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('stores')
    .select('id, name, location, logo')

  if (error) throw error

  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    location: s.location,
    logo: s.logo ?? undefined,
  }))
}

export async function getUserBuilds(userId: string): Promise<Build[]> {
  const supabase = await createClient()

  const { data: builds, error } = await supabase
    .from('builds')
    .select(`
      id, name, created_at, user_id,
      build_components (
        category, quantity,
        products (
          id, name, category, brand, image, socket, ram_type, ram_slots,
          max_ram_speed, form_factor, power_consumption, psu_wattage, specs,
          product_prices (store_id, price, stock, updated_days_ago)
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (builds ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    userId: b.user_id,
    createdAt: new Date(b.created_at),
    components: (b.build_components ?? []).map((bc) => {
      const prod = bc.products as typeof bc.products | null
      return {
        category: bc.category as BuildComponent['category'],
        quantity: bc.quantity,
        product: prod
          ? mapProduct(prod as any, ((prod as any).product_prices ?? []).map(mapPrice))
          : null,
      }
    }),
  }))
}

export async function getBuildById(buildId: string): Promise<Build | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('builds')
    .select(`
      id, name, created_at, user_id,
      build_components (
        category, quantity,
        products (
          id, name, category, brand, image, socket, ram_type, ram_slots,
          max_ram_speed, form_factor, power_consumption, psu_wattage, specs,
          product_prices (store_id, price, stock, updated_days_ago)
        )
      )
    `)
    .eq('id', buildId)
    .single()

  if (error) return null

  return {
    id: data.id,
    name: data.name,
    userId: data.user_id,
    createdAt: new Date(data.created_at),
    components: (data.build_components ?? []).map((bc) => {
      const prod = bc.products as typeof bc.products | null
      return {
        category: bc.category as BuildComponent['category'],
        quantity: bc.quantity,
        product: prod
          ? mapProduct(prod as any, ((prod as any).product_prices ?? []).map(mapPrice))
          : null,
      }
    }),
  }
}
