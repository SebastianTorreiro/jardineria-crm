import { User, Pencil } from 'lucide-react'
import { Database } from '@/types/database.types'
import { EditWorkerDrawer } from './EditWorkerDrawer'

type WorkerRow = Database['public']['Tables']['workers']['Row']

interface WorkerCardProps {
  worker: WorkerRow
  isOwner: boolean
}

export function WorkerCard({ worker, isOwner }: WorkerCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-card p-4 shadow-sm border border-border">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground">
          <User size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-foreground">{worker.name}</h3>
          {worker.is_partner && (
            <span className="text-xs font-medium text-muted-foreground">Socio</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            worker.is_active
              ? 'bg-secondary text-primary'
              : 'bg-accent text-muted-foreground'
          }`}
        >
          {worker.is_active ? 'Activo' : 'Inactivo'}
        </span>
        {isOwner && (
          <EditWorkerDrawer worker={worker}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-primary transition-colors"
              aria-label={`Editar ${worker.name}`}
            >
              <Pencil size={16} />
            </button>
          </EditWorkerDrawer>
        )}
      </div>
    </div>
  )
}
