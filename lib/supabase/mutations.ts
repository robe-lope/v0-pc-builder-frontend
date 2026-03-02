'use client'

import { createClient } from './client'
import type { BuildComponent } from '@/lib/types'

export async function saveBuild(
  name: string,
  userId: string,
  components: BuildComponent[]
): Promise<string> {
  const supabase = createClient()

  const { data: build, error: buildError } = await supabase
    .from('builds')
    .insert({ name, user_id: userId })
    .select('id')
    .single()

  if (buildError) throw buildError

  const buildId = build.id

  const rows = components
    .filter((c) => c.product !== null)
    .map((c) => ({
      build_id: buildId,
      product_id: c.product!.id,
      category: c.category,
      quantity: c.quantity,
    }))

  if (rows.length > 0) {
    const { error: compError } = await supabase.from('build_components').insert(rows)
    if (compError) throw compError
  }

  return buildId
}

export async function deleteBuild(buildId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from('builds').delete().eq('id', buildId)
  if (error) throw error
}
