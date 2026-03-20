'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CronLog } from '@/lib/admin/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Play } from 'lucide-react'

interface Props {
  logs: CronLog[]
}

function StatusBadge({ status }: { status: CronLog['status'] }) {
  const classes = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    running: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${classes[status]}`}>
      {status}
    </span>
  )
}

export function CronPanel({ logs }: Props) {
  const router = useRouter()
  const [running, setRunning] = useState(false)

  async function triggerJob() {
    setRunning(true)
    try {
      const res = await fetch('/api/admin/cron/trigger', { method: 'POST' })
      if (!res.ok) throw new Error(await res.text())
      router.refresh()
    } catch (err) {
      alert('Error: ' + String(err))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Prices Job</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Incrementa <code>updated_days_ago</code> y aplica una fluctuación de ±3% en todos los precios.
            Programado diariamente a las 03:00 UTC.
          </p>
          <Button onClick={triggerJob} disabled={running}>
            <Play className="h-4 w-4 mr-2" />
            {running ? 'Ejecutando...' : 'Ejecutar ahora'}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-base font-semibold mb-3">Historial de ejecuciones</h2>
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-sm">Sin ejecuciones registradas.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Mensaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const started = new Date(log.started_at)
                const finished = log.finished_at ? new Date(log.finished_at) : null
                const durationMs = finished ? finished.getTime() - started.getTime() : null
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.job_name}</TableCell>
                    <TableCell className="text-muted-foreground">{log.triggered_by}</TableCell>
                    <TableCell><StatusBadge status={log.status} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {started.toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {durationMs != null ? `${durationMs}ms` : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                      {log.message ?? '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
