'use client'

import { Drawer } from 'vaul'
import { useState } from 'react'
import { createProperty } from '@/app/(dashboard)/clients/actions' // Need to export this or create it
import { Plus } from 'lucide-react'

// WARNING: I need to ensure 'createProperty' action exists in actions.ts. 
// I will assume for now I will add it next.

interface AddPropertyDrawerProps {
    clientId: string
}

export function AddPropertyDrawer({ clientId }: AddPropertyDrawerProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('client_id', clientId)
        
        // Dynamic import to avoid build errors if I haven't created the action yet? 
        // No, I'll just create the action in the next step.
        const { createProperty } = await import('@/app/(dashboard)/clients/actions')
        await createProperty(formData)
        
        setLoading(false)
        setOpen(false)
    }

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800">
                    <Plus size={16} />
                    Agregar
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[60%] flex-col rounded-t-[10px] bg-zinc-100 outline-none">
                    <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
                        <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
                        <div className="mx-auto max-w-md">
                            <Drawer.Title className="mb-4 text-xl font-bold">
                                Nueva Propiedad
                            </Drawer.Title>
                            
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Dirección</label>
                                    <input name="address" required autoFocus className="block w-full rounded-lg border border-gray-300 p-2.5" placeholder="Calle 123" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Frecuencia (Días)</label>
                                    <input name="frequency" type="number" className="block w-full rounded-lg border border-gray-300 p-2.5" placeholder="15" />
                                </div>

                                <button type="submit" disabled={loading} className="mt-4 w-full rounded-lg bg-green-600 px-5 py-3 text-white font-bold">
                                    {loading ? 'Agregando...' : 'Agregar Propiedad'}
                                </button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
