'use client'

import { Drawer } from 'vaul'
import { useState } from 'react'
import { updateClient } from '@/app/(dashboard)/clients/actions'
import { Edit } from 'lucide-react'

interface ClientEditDrawerProps {
    client: any
    children: React.ReactNode
}

export function ClientEditDrawer({ client, children }: ClientEditDrawerProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('id', client.id)
        
        await updateClient(formData)
        setLoading(false)
        setOpen(false)
    }

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
                            
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
                                    <input name="name" defaultValue={client.name} required className="block w-full rounded-lg border border-gray-300 p-2.5" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input name="phone" defaultValue={client.phone || ''} className="block w-full rounded-lg border border-gray-300 p-2.5" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                                    <input name="email" defaultValue={client.email || ''} className="block w-full rounded-lg border border-gray-300 p-2.5" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
                                    <textarea name="notes" defaultValue={client.notes || ''} rows={3} className="block w-full rounded-lg border border-gray-300 p-2.5" />
                                </div>

                                <button type="submit" disabled={loading} className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 text-white font-bold">
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </form>
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
