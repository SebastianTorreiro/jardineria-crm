'use client'

import { Drawer } from 'vaul'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { createClientAction } from '@/app/(dashboard)/clients/actions'
import { FloatingActionButton } from '../ui/FloatingActionButton'

export function NewClientDrawer() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    
    try {
      const result = await createClientAction(formData)
      if (result.error) {
        alert(result.error)
      } else {
        setOpen(false)
        // Reset form or show success toast
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
                aria-label="Add new client"
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
                New Client
              </Drawer.Title>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                    placeholder="+54 9 11 1234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">Address (Primary Property)</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                    placeholder="Av. Libertador 1234"
                  />
                </div>

                <div>
                  <label htmlFor="frequency" className="mb-1 block text-sm font-medium text-gray-700">Frequency (Days)</label>
                  <input
                    type="number"
                    name="frequency"
                    id="frequency"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
                    placeholder="7"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-lg bg-blue-700 px-5 py-3.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Client'}
                </button>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
