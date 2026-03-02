'use client'

import { Drawer } from 'vaul'
import { useState, useActionState, useEffect } from 'react'
import { updateClient } from '@/app/(dashboard)/clients/actions'
import { Edit, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from '@/components/ui/FormField'

interface ClientEditDrawerProps {
    client: any
    children: React.ReactNode
}

export function ClientEditDrawer({ client, children }: ClientEditDrawerProps) {
    const primaryProperty = client?.properties?.[0]
    const [open, setOpen] = useState(false)
    const [state, action, isPending] = useActionState(updateClient, {
        success: false,
        message: '',
        fieldErrors: {}
    })

    // Handle responses
    useEffect(() => {
        if (state?.success === true) {
            toast.success(state?.message || 'Cliente actualizado exitosamente')
            setOpen(false)
        } else if (state?.success === false && state?.message) {
            toast.error(state?.message || 'Error al actualizar el cliente')
        }
    }, [state])

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                {children}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[80%] flex-col rounded-t-[10px] bg-zinc-100 outline-none">
                    <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
                        <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
                        <div className="mx-auto max-w-md">
                            <Drawer.Title className="mb-4 text-xl font-bold">
                                Editar Cliente
                            </Drawer.Title>
                            
                            <form action={action} className="flex flex-col gap-5">
                                <input type="hidden" name="id" value={client.id} />
                                {primaryProperty && (
                                    <input type="hidden" name="property_id" value={primaryProperty.id} />
                                )}

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
                                    defaultValue={client.name}
                                    error={state.fieldErrors?.name}
                                />

                                <FormField
                                    label="Teléfono"
                                    name="phone"
                                    type="tel"
                                    placeholder="+54 9 11 1234 5678"
                                    defaultValue={client.phone || ''}
                                    error={state.fieldErrors?.phone}
                                />

                                <FormField
                                    label="Dirección de la Propiedad Principal (Obligatorio)"
                                    name="address"
                                    type="text"
                                    placeholder="Av. Libertador 1234"
                                    defaultValue={primaryProperty?.address || ''}
                                    error={state.fieldErrors?.address}
                                />

                                <FormField
                                    label="Frecuencia de Mantenimiento (Días)"
                                    name="frequency"
                                    type="number"
                                    placeholder="Ej: 7 o 15"
                                    defaultValue={primaryProperty?.frequency_days?.toString() || ''}
                                    error={state.fieldErrors?.frequency}
                                />

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Notas Adicionales</label>
                                    <textarea name="notes" defaultValue={client.notes || ''} rows={3} className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500" />
                                </div>

                                <button type="submit" disabled={isPending} className="mt-3 w-full rounded-xl bg-emerald-600 px-5 py-4 text-center text-base font-black text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
                                    {isPending ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
