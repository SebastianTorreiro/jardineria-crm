'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { ExpenseForm } from '@/components/finances/ExpenseForm'

export function NewExpenseDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 shadow-emerald-600/30"
        aria-label="Add expense"
      >
        <Plus size={24} />
      </button>

      <BaseDrawer 
        isOpen={open} 
        onClose={setOpen} 
        title="Nuevo Gasto"
      >
        <ExpenseForm onSuccess={() => setOpen(false)} />
      </BaseDrawer>
    </>
  )
}
