'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { VisitForm } from '@/components/visits/VisitForm'

interface NewVisitDrawerProps {
    defaultDate: Date
}

export function NewVisitDrawer({ defaultDate }: NewVisitDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50">
          <button
              onClick={() => setOpen(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 shadow-blue-600/30"
              aria-label="Add new visit"
          >
              <Plus size={24} />
          </button>
      </div>

      <BaseDrawer 
        isOpen={open} 
        onClose={setOpen} 
        title="Nueva Visita"
      >
        <VisitForm defaultDate={defaultDate} onSuccess={() => setOpen(false)} />
      </BaseDrawer>
    </>
  )
}
