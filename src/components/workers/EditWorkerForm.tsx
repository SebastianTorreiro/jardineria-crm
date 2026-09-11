'use client'

import { useActionState, useEffect } from 'react'
import { updateWorker } from '@/app/(dashboard)/workers/actions'
import { FormField } from '@/components/ui/FormField'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type WorkerRow = Database['public']['Tables']['workers']['Row']

interface EditWorkerFormProps {
  worker: WorkerRow
  onSuccess: () => void
  onCancel: () => void
}

const initialState = {
  success: false,
  message: '',
  fieldErrors: {}
}

export function EditWorkerForm({ worker, onSuccess, onCancel }: EditWorkerFormProps) {
  const [state, action, isPending] = useActionState(updateWorker, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success('Trabajador actualizado correctamente')
      onSuccess()
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={worker.id} />

      <FormField
        name="name"
        label="Nombre"
        type="text"
        required
        defaultValue={worker.name}
        error={state?.fieldErrors?.name}
      />

      <FormField
        name="share_percentage"
        label={`Porcentaje de reparto de "${worker.name}"`}
        type="number"
        min="0"
        max="100"
        step="0.01"
        required
        autoFocus
        defaultValue={worker.share_percentage}
        error={state?.fieldErrors?.share_percentage}
      />
      <p className="-mt-3 text-xs text-muted-foreground">
        Peso relativo al resto de los socios seleccionados en cada visita — se
        renormaliza a 100% entre ellos, no es un porcentaje fijo del total.
      </p>

      <div className="flex items-center gap-2">
        <input
          id="is_partner"
          name="is_partner"
          type="checkbox"
          defaultChecked={worker.is_partner ?? false}
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <label htmlFor="is_partner" className="text-sm font-medium text-foreground">
          Es socio (participa del reparto de ganancias)
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked={worker.is_active}
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-foreground">
          Activo (aparece para completar visitas)
        </label>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
    </form>
  )
}
