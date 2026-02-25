'use client'

import { useActionState, useEffect } from 'react'
import { createClientAction } from '@/app/(dashboard)/clients/actions'
import { FormField } from '@/components/ui/FormField'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ClientFormProps {
  onSuccess: () => void
}

export function ClientForm({ onSuccess }: ClientFormProps) {
  const router = useRouter()
  const [state, action, isPending] = useActionState(createClientAction, {
    success: false,
    message: '',
    fieldErrors: {}
  })

  useEffect(() => {
    if (state.success) {
      toast.success('Cliente creado exitosamente')
      router.refresh()
      onSuccess()
    }
  }, [state.success, onSuccess, router])

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

      <FormField
        label="Teléfono"
        name="phone"
        type="tel"
        placeholder="+54 9 11 1234 5678"
        error={state.fieldErrors?.phone}
      />

      <FormField
        label="Dirección de la Propiedad Principal (Obligatorio)"
        name="address"
        type="text"
        placeholder="Av. Libertador 1234"
        error={state.fieldErrors?.address}
      />

      <FormField
        label="Frecuencia de Mantenimiento (Días)"
        name="frequency"
        type="number"
        placeholder="Ej: 7 o 15"
        error={state.fieldErrors?.frequency}
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 w-full rounded-xl bg-blue-600 px-5 py-4 text-center text-base font-black text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Creando...
          </>
        ) : (
          'Crear Cliente'
        )}
      </button>
    </form>
  )
}
