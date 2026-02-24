'use client'

import { Drawer } from 'vaul'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { createExpense } from '@/app/(dashboard)/finances/actions'

const CATEGORIES = [
  'Insumos',
  'Combustible',
  'Comida',
  'Mantenimiento',
  'Otros'
]

export function NewExpenseDrawer() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    const formData = new FormData(event.currentTarget)

    try {
      const result = await createExpense(formData)
      if (!result.success) {
        alert(result.message || 'Error registrando gasto')
      } else {
        // Nuclear Option: Force Refresh + Delay
        router.refresh()
        await new Promise(r => setTimeout(r, 500))
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      alert('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button
            className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
            aria-label="Add expense"
        >
            <Plus size={24} />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[90%] flex-col rounded-t-[10px] bg-zinc-100 outline-none">
          <div className="flex-1 overflow-y-auto rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 text-xl font-bold">
                Nuevo Gasto
              </Drawer.Title>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Description */}
                <div>
                  <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Ej: Nafta, Fertilizante..."
                  />
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">Monto ($)</label>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    required
                    step="0.01"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                  >
                    <option value="">Seleccionar Categoría</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-lg bg-blue-700 px-5 py-3.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Registrar Gasto'}
                </button>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
