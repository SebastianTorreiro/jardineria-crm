'use client'

import { Drawer } from 'vaul'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { createVisit } from '@/app/(dashboard)/visits/actions'
import { getClients } from '@/app/(dashboard)/clients/actions'
import { format } from 'date-fns'

interface NewVisitDrawerProps {
    defaultDate: Date
}

export function NewVisitDrawer({ defaultDate }: NewVisitDrawerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  
  // Load clients on open (or mount, simpler for now)
  useEffect(() => {
    if (open && clients.length === 0) {
        getClients('').then(data => {
            if (data) setClients(data)
        })
    }
  }, [open, clients.length])

  const selectedClient = clients.find(c => c.id === selectedClientId)
  // Assuming property structure: clients have array of properties from previous action getClients query
  // Wait, getClients in action.ts returns properties array? Yes!
  const clientProperties = selectedClient?.properties || []

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    
    // Combine date and time manually to avoid Timezone shifts
    const dateInput = formData.get('date_day') as string
    
    // Send as local string 'YYYY-MM-DD'
    const fullDateStr = format(new Date(`${dateInput}T12:00:00`), 'yyyy-MM-dd')
    
    formData.set('date', fullDateStr)

    try {
      const result = await createVisit(formData)
      if (result.error) {
        alert(result.error)
      } else {
        setOpen(false)
        setSelectedClientId('')
      }
    } catch (error) {
      console.error(error)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <div className="fixed bottom-20 right-4 z-50">
            <button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                aria-label="Add new visit"
            >
                <Plus size={24} />
            </button>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[90%] flex-col rounded-t-[10px] bg-zinc-100 outline-none">
          <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 text-xl font-bold">
                Nueva Visita
              </Drawer.Title>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* 1. Client Select */}
                <div>
                  <label htmlFor="client" className="mb-1 block text-sm font-medium text-gray-700">Cliente</label>
                  <select
                    id="client"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar Cliente</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Property Select */}
                <div>
                  <label htmlFor="property_id" className="mb-1 block text-sm font-medium text-gray-700">Propiedad</label>
                  <select
                    name="property_id"
                    id="property_id"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                    required
                    disabled={!selectedClientId}
                  >
                    <option value="">Seleccionar Propiedad</option>
                    {clientProperties.map((prop: any) => (
                        <option key={prop.id} value={prop.id}>{prop.address}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date_day" className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
                        <input
                            type="date"
                            name="date_day"
                            id="date_day"
                            defaultValue={format(defaultDate, 'yyyy-MM-dd')}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="time" className="mb-1 block text-sm font-medium text-gray-700">Hora</label>
                        <input
                            type="time"
                            name="time"
                            id="time"
                            defaultValue="09:00"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                    </div>
                </div>

                {/* 4. Notes */}
                <div>
                  <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Podar arbustos..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-lg bg-blue-700 px-5 py-3.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Agendar Visita'}
                </button>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
