'use client'

import { useActionState, useEffect } from 'react'
import { createWorker } from '@/app/(dashboard)/workers/actions'
import { FormField } from '@/components/ui/FormField'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface WorkerFormProps {
  onSuccess: () => void
}

export function WorkerForm({ onSuccess }: WorkerFormProps) {
  const router = useRouter()
  const [state, action, isPending] = useActionState(createWorker, {
    success: false,
    message: '',
    fieldErrors: {}
  })

  useEffect(() => {
    if (state.success) {
      toast.success('Trabajador agregado exitosamente')
      router.refresh()
      onSuccess()
    }
  }, [state])

  return (
    <form action={action} className="flex flex-col gap-5">
      {!state.success && state.message && (
        <div className="p-3.5 text-sm font-bold text-red-800 bg-red-50 rounded-xl border border-red-200/60 shadow-sm animate-in fade-in">
          {state.message}
        </div>
      )}

      <FormField
        label="Nombre (Obligatorio)"
        name="name"
        type="text"
        placeholder="Juan Pérez"
        error={state.fieldErrors?.name}
      />

      <div className="flex items-center gap-2">
        <input
          id="is_partner"
          name="is_partner"
          type="checkbox"
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <label htmlFor="is_partner" className="text-sm font-medium text-foreground">
          Es socio (participa del reparto de ganancias)
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 w-full rounded-xl bg-primary px-5 py-4 text-center text-base font-black text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-ring disabled:opacity-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Creando...
          </>
        ) : (
          'Crear Trabajador'
        )}
      </button>
    </form>
  )
}
