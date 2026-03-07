'use client'

import { useState } from 'react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { EditVisitForm } from '@/components/visits/EditVisitForm'

import { ExpandedVisit } from './VisitCard'

interface EditVisitDrawerProps {
    visit: ExpandedVisit
    children: React.ReactNode
}

export function EditVisitDrawer({ visit, children }: EditVisitDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>

      <BaseDrawer 
        isOpen={open} 
        onClose={setOpen} 
        title="Editar Visita"
      >
        <EditVisitForm visit={visit} onSuccess={() => setOpen(false)} />
      </BaseDrawer>
    </>
  )
}
