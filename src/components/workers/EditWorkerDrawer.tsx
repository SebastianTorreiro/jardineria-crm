'use client'

import { useState } from 'react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { EditWorkerForm } from '@/components/workers/EditWorkerForm'
import { Database } from '@/types/database.types'

type WorkerRow = Database['public']['Tables']['workers']['Row']

interface EditWorkerDrawerProps {
  worker: WorkerRow
  children: React.ReactNode
}

export function EditWorkerDrawer({ worker, children }: EditWorkerDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>

      <BaseDrawer isOpen={open} onClose={setOpen} title="Editar Trabajador">
        <EditWorkerForm worker={worker} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </BaseDrawer>
    </>
  )
}
