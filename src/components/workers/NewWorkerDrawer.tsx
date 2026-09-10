'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { WorkerForm } from '@/components/workers/WorkerForm'

export function NewWorkerDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
          aria-label="Add new worker"
        >
          <Plus size={24} />
        </button>
      </div>

      <BaseDrawer
        isOpen={open}
        onClose={setOpen}
        title="Nuevo Trabajador"
      >
        <WorkerForm onSuccess={() => setOpen(false)} />
      </BaseDrawer>
    </>
  )
}
