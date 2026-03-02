'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { deleteVisit } from '@/app/(dashboard)/visits/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface DeleteVisitDrawerProps {
    visit: any
    children: React.ReactNode
}

export function DeleteVisitDrawer({ visit, children }: DeleteVisitDrawerProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
      startTransition(async () => {
          const result = await deleteVisit({ id: visit.id })
          if (result.success) {
              toast.success('Visita eliminada')
              setOpen(false)
              router.refresh()
          } else {
              toast.error(result.message || 'Error al eliminar')
          }
      })
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>

      <BaseDrawer 
        isOpen={open} 
        onClose={setOpen} 
        title="Eliminar Visita"
      >
        <div className="flex flex-col gap-6">
            <p className="text-gray-600">
                ¿Estás seguro de que deseas eliminar esta visita programada? Esta acción no se puede deshacer.
            </p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                    className="flex items-center justify-center rounded-xl bg-gray-100 px-5 py-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 sm:w-auto"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50 sm:w-auto"
                >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    Eliminar
                </button>
            </div>
        </div>
      </BaseDrawer>
    </>
  )
}
