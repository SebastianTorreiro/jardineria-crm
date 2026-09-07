'use client'

import { useState } from 'react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { EditSupplyForm } from '@/components/inventory/EditSupplyForm'
import { Supply } from '@/app/(dashboard)/inventory/actions'

interface EditSupplyDrawerProps {
  supply: Supply
  children: React.ReactNode
}

export function EditSupplyDrawer({ supply, children }: EditSupplyDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>

      <BaseDrawer
        isOpen={open}
        onClose={setOpen}
        title="Actualizar Stock"
      >
        <EditSupplyForm supply={supply} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </BaseDrawer>
    </>
  )
}
