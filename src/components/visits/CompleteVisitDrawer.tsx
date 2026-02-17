'use client'

import { Drawer } from 'vaul'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeVisit } from '@/app/(dashboard)/visits/actions'

interface CompleteVisitDrawerProps {
  visit: any
  children: React.ReactNode
}

export function CompleteVisitDrawer({ visit, children }: CompleteVisitDrawerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault() // Stop default form submit
    if (loading) return
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    formData.append('visit_id', visit.id)

    try {
      // 1. Call Server Action
      const result = await completeVisit(formData)
      if (result.error) {
        alert(result.error)
      } else {
        // 2. Force Hard Refresh
        router.refresh()
        // 3. Small artificial delay to let the UI paint
        await new Promise(r => setTimeout(r, 500))
        // 4. Close
        setOpen(false)
        // Ideally show a toast
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
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[80%] flex-col rounded-t-[10px] bg-zinc-100 outline-none">
          <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 text-xl font-bold">
                Completar Trabajo
              </Drawer.Title>
              
              <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium text-gray-900">{visit.properties?.clients?.name}</p>
                <p className="mt-1 text-sm text-gray-500">{visit.properties?.address}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label htmlFor="real_income" className="mb-2 block text-sm font-medium text-gray-700">
                    Ingreso Real ($)
                  </label>
                  <input
                    type="number"
                    name="real_income"
                    id="real_income"
                    required
                    autoFocus
                    step="0.01"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-3xl font-bold text-center text-gray-900 focus:border-green-500 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="mb-2 block text-sm font-medium text-gray-700">
                    Observaciones finales
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-green-500 focus:ring-green-500"
                    placeholder="Se usó veneno para hormigas, cliente pidió poda extra la próxima..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-lg bg-green-600 px-5 py-4 text-center text-lg font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Confirmar y Cobrar'}
                </button>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
