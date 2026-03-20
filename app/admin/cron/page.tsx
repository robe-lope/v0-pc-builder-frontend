export const dynamic = 'force-dynamic'

import { getCronLogs } from '@/lib/admin/queries'
import { CronPanel } from './cron-panel'

export default async function AdminCronPage() {
  const logs = await getCronLogs(20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cron Jobs</h1>
        <p className="text-muted-foreground">Gestión y logs de tareas programadas</p>
      </div>
      <CronPanel logs={logs} />
    </div>
  )
}
