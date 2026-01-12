// Core types for the PC Builder app

export type ComponentCategory = "cpu" | "motherboard" | "gpu" | "ram" | "storage" | "psu" | "case" | "cooler" | "other"

export type SocketType = "AM4" | "AM5" | "LGA1700" | "LGA1200"
export type RamType = "DDR4" | "DDR5"
export type FormFactor = "ATX" | "Micro-ATX" | "Mini-ITX" | "E-ATX"

export interface Store {
  id: string
  name: string
  location: string
  logo?: string
}

export interface ProductPrice {
  storeId: string
  price: number
  stock: boolean
  updatedDaysAgo: number
}

export interface Product {
  id: string
  name: string
  category: ComponentCategory
  brand: string
  image: string
  prices: ProductPrice[]
  specs: Record<string, string | number>
  // Compatibility fields
  socket?: SocketType
  ramType?: RamType
  ramSlots?: number
  maxRamSpeed?: number
  formFactor?: FormFactor
  powerConsumption?: number // watts
  psuWattage?: number
}

export interface BuildComponent {
  category: ComponentCategory
  product: Product | null
  quantity: number
}

export interface Build {
  id: string
  name: string
  components: BuildComponent[]
  createdAt: Date
}

export interface CompatibilityWarning {
  type: "error" | "warning"
  message: string
  categories: ComponentCategory[]
}

export interface FilterOptions {
  categories: ComponentCategory[]
  brands: string[]
  priceRange: [number, number]
  stores: string[]
}

export interface SortOption {
  value: string
  label: string
}
