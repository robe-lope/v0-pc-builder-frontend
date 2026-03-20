'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminProfile } from '@/lib/admin/types'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

interface Props {
  profiles: AdminProfile[]
  currentUserId: string
}

export function UsersTable({ profiles, currentUserId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleRole(profile: AdminProfile) {
    const newRole = profile.role === 'admin' ? 'user' : 'admin'
    setLoading(profile.id)
    try {
      const res = await fetch(`/api/admin/users/${profile.id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error(await res.text())
      router.refresh()
    } catch (err) {
      alert('Error: ' + String(err))
    } finally {
      setLoading(null)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Registrado</TableHead>
          <TableHead>Admin</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => {
          const isSelf = profile.id === currentUserId
          return (
            <TableRow key={profile.id}>
              <TableCell className="font-medium">{profile.email}</TableCell>
              <TableCell className="text-muted-foreground">
                {profile.full_name ?? '—'}
              </TableCell>
              <TableCell>
                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                  {profile.role}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString('es-AR')
                  : '—'}
              </TableCell>
              <TableCell>
                <Switch
                  checked={profile.role === 'admin'}
                  disabled={isSelf || loading === profile.id}
                  onCheckedChange={() => toggleRole(profile)}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
