'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminPrice } from '@/lib/admin/types'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface EditState {
  productId: string
  storeId: string
  price: string
  stock: boolean
}

interface Props {
  prices: AdminPrice[]
}

export function PricesTable({ prices }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)

  function startEdit(price: AdminPrice) {
    setEditing({
      productId: price.product_id,
      storeId: price.store_id,
      price: String(price.price),
      stock: price.stock,
    })
  }

  function cancelEdit() {
    setEditing(null)
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/prices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: editing.productId,
          storeId: editing.storeId,
          price: Number(editing.price),
          stock: editing.stock,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setEditing(null)
      router.refresh()
    } catch (err) {
      alert('Error: ' + String(err))
    } finally {
      setSaving(false)
    }
  }

  function isEditing(price: AdminPrice) {
    return editing?.productId === price.product_id && editing?.storeId === price.store_id
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Tienda</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actualizado</TableHead>
          <TableHead className="w-28">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prices.map((price) => {
          const active = isEditing(price)
          return (
            <TableRow
              key={`${price.product_id}-${price.store_id}`}
              className={active ? 'bg-muted/50' : undefined}
            >
              <TableCell className="font-medium max-w-[180px] truncate">
                {price.product_name}
              </TableCell>
              <TableCell className="text-muted-foreground">{price.store_name}</TableCell>
              <TableCell>
                {active ? (
                  <Input
                    type="number"
                    className="w-28 h-8"
                    value={editing!.price}
                    onChange={(e) => setEditing((prev) => prev ? { ...prev, price: e.target.value } : prev)}
                  />
                ) : (
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => startEdit(price)}
                  >
                    ${price.price.toLocaleString('es-AR')}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {active ? (
                  <Switch
                    checked={editing!.stock}
                    onCheckedChange={(val) => setEditing((prev) => prev ? { ...prev, stock: val } : prev)}
                  />
                ) : (
                  <span
                    className={`text-xs font-medium cursor-pointer ${price.stock ? 'text-green-600' : 'text-destructive'}`}
                    onClick={() => startEdit(price)}
                  >
                    {price.stock ? 'En stock' : 'Sin stock'}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {price.updated_days_ago === 0 ? 'Hoy' : `hace ${price.updated_days_ago}d`}
              </TableCell>
              <TableCell>
                {active ? (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" disabled={saving} onClick={saveEdit}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => startEdit(price)}>
                    Editar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
