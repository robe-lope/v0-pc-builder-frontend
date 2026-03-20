import type { UserRole } from '@/lib/types'

export interface AdminStats {
  productsCount: number
  usersCount: number
  buildsCount: number
  storesCount: number
  lastCronRun: string | null
  lastCronStatus: string | null
}

export interface AdminProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface CronLog {
  id: string
  job_name: string
  triggered_by: 'cron' | 'manual'
  status: 'running' | 'success' | 'error'
  message: string | null
  started_at: string
  finished_at: string | null
}

export interface AdminPrice {
  product_id: string
  store_id: string
  price: number
  stock: boolean
  updated_days_ago: number
  product_name: string
  store_name: string
}
