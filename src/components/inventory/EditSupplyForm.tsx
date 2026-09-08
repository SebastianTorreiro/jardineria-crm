'use client'

import { useActionState, useEffect } from 'react'
import { updateSupplyStock } from '@/app/(dashboard)/inventory/actions'
import { Supply } from '@/app/(dashboard)/inventory/actions'
import { FormField } from '@/components/ui/FormField'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface EditSupplyFormProps {
  supply: Supply
  onSuccess: () => void
  onCancel: () => void
}

const initialState = {
  success: false,
  message: '',
  fieldErrors: {}
}

export function EditSupplyForm({ supply, onSuccess, onCancel }: EditSupplyFormProps) {
  const [state, action, isPending] = useActionState(updateSupplyStock, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success('Stock actualizado correctamente')
      onSuccess()
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={supply.id} />

      <FormField
        name="quantity"
        label={`Nuevo Stock de "${supply.name}" (${supply.unit})`}
        type="number"
        min="0"
        required
        autoFocus
        defaultValue={supply.current_stock}
        error={state?.fieldErrors?.quantity}
      />

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
            'Guardar Stock'
          )}
        </button>
      </div>
    </form>
  )
}
