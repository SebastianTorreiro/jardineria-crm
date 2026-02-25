'use client'

import { useActionState, useEffect } from 'react'
import { createSupply } from '@/app/(dashboard)/inventory/actions'
import { FormField } from '@/components/ui/FormField'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface SupplyFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const initialState = {
  success: false,
  message: '',
  fieldErrors: {}
}

export function SupplyForm({ onSuccess, onCancel }: SupplyFormProps) {
  const [state, action, isPending] = useActionState(createSupply, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success('Insumo agregado correctamente')
      onSuccess()
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state.success, state.message, onSuccess])

  return (
    <form action={action} className="space-y-5">
      <FormField 
        name="name" 
        label="Nombre" 
        required 
        error={state?.fieldErrors?.name}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField 
          name="current_stock" 
          label="Stock Actual" 
          type="number"
          required 
          error={state?.fieldErrors?.current_stock}
        />
        <FormField 
          name="unit" 
          label="Unidad (ej. L, Kg)" 
          required 
          defaultValue="unidades"
          error={state?.fieldErrors?.unit}
        />
      </div>

      <div>
        <FormField 
          name="min_stock" 
          label="Alerta Stock Mínimo" 
          type="number"
          required 
          error={state?.fieldErrors?.min_stock}
        />
        <p className="mt-1 text-xs text-slate-500 ml-0.5">Se mostrará una alerta si el stock baja de este número.</p>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Insumo'
          )}
        </button>
      </div>
    </form>
  )
}
