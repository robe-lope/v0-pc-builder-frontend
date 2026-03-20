export const dynamic = 'force-dynamic'

import { getAdminStats } from '@/lib/admin/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, Cpu, Store, Clock } from 'lucide-react'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    { label: 'Productos', value: stats.productsCount, icon: Package },
    { label: 'Usuarios', value: stats.usersCount, icon: Users },
    { label: 'Builds', value: stats.buildsCount, icon: Cpu },
    { label: 'Tiendas', value: stats.storesCount, icon: Store },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Vista general del sistema</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Último Cron Job
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.lastCronRun ? (
            <div className="flex items-center gap-3">
              <span
                className={
                  stats.lastCronStatus === 'success'
                    ? 'text-green-600 font-medium'
                    : stats.lastCronStatus === 'error'
                    ? 'text-destructive font-medium'
                    : 'text-yellow-600 font-medium'
                }
              >
                {stats.lastCronStatus}
              </span>
              <span className="text-muted-foreground text-sm">
                {new Date(stats.lastCronRun).toLocaleString('es-AR')}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Sin ejecuciones registradas</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
