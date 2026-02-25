'use client'

import { useActionState, useEffect } from 'react'
import { createTool } from '@/app/(dashboard)/inventory/actions'
import { FormField } from '@/components/ui/FormField'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ToolFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const initialState = {
  success: false,
  message: '',
  fieldErrors: {}
}

export function ToolForm({ onSuccess, onCancel }: ToolFormProps) {
  const [state, action, isPending] = useActionState(createTool, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success('Herramienta agregada correctamente')
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

      <FormField 
        name="brand" 
        label="Marca" 
        error={state?.fieldErrors?.brand}
      />

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-emerald-900 mb-1.5 ml-0.5">
          Estado Inicial
        </label>
        <select 
          id="status"
          name="status" 
          className="block w-full rounded-lg border-slate-200 bg-white shadow-sm ring-emerald-500/20 transition-all duration-200 sm:text-sm px-3 py-2 border outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2"
        >
          <option value="ok">Disponible</option>
          <option value="service">En Mantenimiento</option>
          <option value="broken">Roto</option>
        </select>
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
            'Guardar Herramienta'
          )}
        </button>
      </div>
    </form>
  )
}
