export const dynamic = 'force-dynamic'

import { getAllProfiles } from '@/lib/admin/queries'
import { createClient } from '@/lib/supabase/server'
import { UsersTable } from './users-table'

export default async function AdminUsuariosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const profiles = await getAllProfiles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">{profiles.length} usuarios registrados</p>
      </div>
      <UsersTable profiles={profiles} currentUserId={user?.id ?? ''} />
    </div>
  )
}
