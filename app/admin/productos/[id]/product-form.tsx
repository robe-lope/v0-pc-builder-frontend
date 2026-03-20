'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, Store, ComponentCategory } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu', 'case', 'cooler', 'other']
const SOCKETS = ['AM4', 'AM5', 'LGA1700', 'LGA1200']
const RAM_TYPES = ['DDR4', 'DDR5']
const FORM_FACTORS = ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX']

interface Props {
  product: Product | null
  stores: Store[]
}

export function ProductForm({ product, stores }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState(product?.name ?? '')
  const [category, setCategory] = useState<ComponentCategory>(product?.category ?? 'cpu')
  const [brand, setBrand] = useState(product?.brand ?? '')
  const [image, setImage] = useState(product?.image ?? '')
  const [socket, setSocket] = useState(product?.socket ?? '')
  const [ramType, setRamType] = useState(product?.ramType ?? '')
  const [ramSlots, setRamSlots] = useState(String(product?.ramSlots ?? ''))
  const [maxRamSpeed, setMaxRamSpeed] = useState(String(product?.maxRamSpeed ?? ''))
  const [formFactor, setFormFactor] = useState(product?.formFactor ?? '')
  const [powerConsumption, setPowerConsumption] = useState(String(product?.powerConsumption ?? ''))
  const [psuWattage, setPsuWattage] = useState(String(product?.psuWattage ?? ''))
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    Object.entries(product?.specs ?? {}).map(([key, value]) => ({ key, value: String(value) }))
  )

  function addSpec() {
    setSpecs((prev) => [...prev, { key: '', value: '' }])
  }

  function updateSpec(index: number, field: 'key' | 'value', val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)))
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const specsObj = specs.reduce<Record<string, string | number>>((acc, { key, value }) => {
      if (key.trim()) {
        const num = Number(value)
        acc[key.trim()] = isNaN(num) || value === '' ? value : num
      }
      return acc
    }, {})

    const payload = {
      id: product?.id,
      name,
      category,
      brand,
      image,
      specs: specsObj,
      socket: socket || null,
      ram_type: ramType || null,
      ram_slots: ramSlots ? Number(ramSlots) : null,
      max_ram_speed: maxRamSpeed ? Number(maxRamSpeed) : null,
      form_factor: formFactor || null,
      power_consumption: powerConsumption ? Number(powerConsumption) : null,
      psu_wattage: psuWattage ? Number(psuWattage) : null,
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      router.push('/admin/productos')
      router.refresh()
    } catch (err) {
      alert('Error: ' + String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label>Nombre</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as ComponentCategory)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Marca</Label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>

        <div className="col-span-2 space-y-2">
          <Label>Imagen (URL)</Label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Compatibilidad (opcional)</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Socket</Label>
            <Select value={socket || '_none'} onValueChange={(v) => setSocket(v === '_none' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Ninguno" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Ninguno</SelectItem>
                {SOCKETS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>RAM Type</Label>
            <Select value={ramType || '_none'} onValueChange={(v) => setRamType(v === '_none' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Ninguno" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Ninguno</SelectItem>
                {RAM_TYPES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Form Factor</Label>
            <Select value={formFactor || '_none'} onValueChange={(v) => setFormFactor(v === '_none' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Ninguno" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Ninguno</SelectItem>
                {FORM_FACTORS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>RAM Slots</Label>
            <Input type="number" value={ramSlots} onChange={(e) => setRamSlots(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Max RAM Speed (MHz)</Label>
            <Input type="number" value={maxRamSpeed} onChange={(e) => setMaxRamSpeed(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Consumo (W)</Label>
            <Input type="number" value={powerConsumption} onChange={(e) => setPowerConsumption(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>PSU Wattage (W)</Label>
            <Input type="number" value={psuWattage} onChange={(e) => setPsuWattage(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Specs</p>
          <Button type="button" variant="outline" size="sm" onClick={addSpec}>
            <Plus className="h-4 w-4 mr-1" /> Agregar
          </Button>
        </div>
        {specs.map((spec, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Clave"
              value={spec.key}
              onChange={(e) => updateSpec(i, 'key', e.target.value)}
            />
            <Input
              placeholder="Valor"
              value={spec.value}
              onChange={(e) => updateSpec(i, 'value', e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={() => removeSpec(i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/productos')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
