import { getWorkers } from './actions'
import { WorkerCard } from '@/components/workers/WorkerCard'
import { NewWorkerDrawer } from '@/components/workers/NewWorkerDrawer'

export const dynamic = 'force-dynamic'

export default async function WorkersPage() {
  const workers = await getWorkers()

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <div className="sticky top-0 z-40 border-b border-border bg-card p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Trabajadores</h1>
      </div>

      <div className="p-4">
        {workers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <p>No hay trabajadores registrados.</p>
            <p className="text-sm">Toca el botón + para agregar uno.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-24 md:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </div>

      <NewWorkerDrawer />
    </div>
  )
}
