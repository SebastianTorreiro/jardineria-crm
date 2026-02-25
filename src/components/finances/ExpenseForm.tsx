'use client'

import { useActionState, useEffect } from 'react'
import { createExpense } from '@/app/(dashboard)/finances/actions'
import { FormField } from '@/components/ui/FormField'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ExpenseFormProps {
  onSuccess: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'fuel', label: 'Combustible' },
  { value: 'equipment', label: 'Equipamiento e Insumos' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'other', label: 'Otros' }
]

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const router = useRouter()
  // useActionState expects (action, initialState)
  const [state, action, isPending] = useActionState(createExpense, {
    success: false,
    message: '',
    fieldErrors: {}
  })

  // Watch for successful submission safely passing callbacks inside effects
  useEffect(() => {
    if (state.success) {
      toast.success('Gasto registrado exitosamente')
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
        label="Descripción"
        name="description"
        placeholder="Ej: Nafta cortadora..."
        error={state.fieldErrors?.description}
      />

      <FormField
        label="Monto ($)"
        name="amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={state.fieldErrors?.amount}
      />

      <FormField
        label="Fecha"
        name="date"
        type="date"
        defaultValue={new Date().toISOString().split('T')[0]}
        error={state.fieldErrors?.date}
      />

      <div className="w-full">
        <label htmlFor="category" className="block text-sm font-medium text-emerald-900 mb-1.5 ml-0.5">
          Categoría
        </label>
        <select
          name="category"
          id="category"
          className={`block w-full rounded-lg border-slate-200 bg-white shadow-sm ring-emerald-500/20 transition-all duration-200 sm:text-sm px-3 py-2 border outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-2 h-[42px] ${state.fieldErrors?.category ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
        >
          <option value="">Seleccionar Categoría...</option>
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {state.fieldErrors?.category && (
          <div className="mt-1.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 px-0.5">
            {state.fieldErrors.category.map((err: string) => <p key={err}>{err}</p>)}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 w-full rounded-xl bg-emerald-600 px-5 py-4 text-center text-base font-black text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Guardando...
          </>
        ) : (
          'Registrar Gasto'
        )}
      </button>
    </form>
  )
}
