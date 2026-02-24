"use client";

import { Drawer } from 'vaul'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { completeVisit, previewVisitProfit } from '@/app/(dashboard)/visits/actions'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CompleteVisitDrawerProps {
  visit: any
  children: React.ReactNode
}

export function CompleteVisitDrawer({ visit, children }: CompleteVisitDrawerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workers, setWorkers] = useState<any[]>([])
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState<string>('')
  const [directExpenses, setDirectExpenses] = useState<string>('')
  const [preview, setPreview] = useState<any[]>([])
  const router = useRouter()

  // Fetch workers when opening
  async function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
    if (newOpen && workers.length === 0) {
      const { getWorkers } = await import('@/app/(dashboard)/visits/actions')
      const data = await getWorkers()
      setWorkers(data)
      const partnerIds = data.filter(w => w.is_partner).map(w => w.id)
      setSelectedWorkers(partnerIds)
    }
  }

  // Update preview when inputs change
  useEffect(() => {
    if (selectedWorkers.length > 0) {
        const incomeValue = parseFloat(totalPrice) || 0
        const expensesValue = parseFloat(directExpenses) || 0
        previewVisitProfit(visit.id, incomeValue, expensesValue, selectedWorkers).then(setPreview)
    } else {
        setPreview([])
    }
  }, [totalPrice, directExpenses, selectedWorkers, visit.id])

  function toggleWorker(id: string) {
    setSelectedWorkers(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    
    if (selectedWorkers.length === 0) {
        setError('Selecciona al menos un trabajador')
        return
    }

    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const data = {
        id: visit.id,
        total_price: parseFloat(totalPrice) || 0,
        direct_expenses: parseFloat(directExpenses) || 0,
        notes: (formData.get('notes') as string) || '',
        attendees: selectedWorkers
    }

    try {
      const result = await completeVisit(data)
      if (!result.success) {
        setError(result.message || 'Error al completar la visita')
      } else {
        router.refresh()
        await new Promise(r => setTimeout(r, 500))
        setOpen(false)
      }
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={handleOpenChange}>
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[90%] flex-col rounded-t-[24px] bg-slate-50 outline-none border-t border-slate-200">
          <div className="flex-1 overflow-y-auto rounded-t-[24px] bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-6 h-1 w-12 flex-shrink-0 rounded-full bg-slate-200" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-6 text-2xl font-bold text-emerald-900 tracking-tight text-center">
                Completar Trabajo
              </Drawer.Title>
              
              <div className="mb-8 rounded-2xl bg-emerald-50/50 p-5 border border-emerald-100/50">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700/70">Cliente</p>
                </div>
                <p className="text-lg font-bold text-emerald-950 leading-tight">{visit.properties?.clients?.name}</p>
                <p className="mt-1 text-sm text-emerald-700 font-medium opacity-80">{visit.properties?.address}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-emerald-900 uppercase tracking-wider ml-1">
                    ¿Quiénes asistieron?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {workers.map(worker => (
                        <button
                            key={worker.id}
                            type="button"
                            onClick={() => toggleWorker(worker.id)}
                            className={cn(
                                "flex items-center justify-center p-4 rounded-xl border text-sm font-bold transition-all duration-200 shadow-sm",
                                selectedWorkers.includes(worker.id)
                                    ? "bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-500/10 scale-[1.02]"
                                    : "bg-white border-slate-200 text-emerald-900 hover:border-emerald-200 hover:bg-emerald-50/30"
                            )}
                        >
                            {worker.name}
                        </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="total_price" className="block text-sm font-bold text-emerald-900 uppercase tracking-wider ml-1">
                      Precio Total
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-600/50">$</span>
                      <input
                          type="number"
                          name="total_price"
                          id="total_price"
                          required
                          autoFocus
                          step="0.01"
                          value={totalPrice}
                          onChange={(e) => setTotalPrice(e.target.value)}
                          className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 pl-12 text-2xl font-black text-emerald-950 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                          placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="direct_expenses" className="block text-sm font-bold text-emerald-900 uppercase tracking-wider ml-1">
                      Gastos Directos
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-600/50">$</span>
                      <input
                          type="number"
                          name="direct_expenses"
                          id="direct_expenses"
                          required
                          step="0.01"
                          value={directExpenses}
                          onChange={(e) => setDirectExpenses(e.target.value)}
                          className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 pl-12 text-2xl font-black text-emerald-950 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                          placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Breakdown Preview */}
                <div className="space-y-3 p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
                    <p className="text-xs font-bold text-emerald-700/70 uppercase tracking-widest ml-1 mb-2">Desglose de Ganancias</p>
                    
                    {preview.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-emerald-100 shadow-sm font-bold text-emerald-900 text-sm">
                                {preview.map((p, i) => (
                                    <span key={p.name}>
                                        {i > 0 && <span className="mx-2 text-emerald-300">|</span>}
                                        {p.name} ({p.percentage}%): <span className="font-black text-emerald-950">${p.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-4 rounded-xl bg-white border border-emerald-100 shadow-sm text-sm font-bold text-emerald-600/50">
                            Ingresa los montos y selecciona trabajadores para ver el desglose
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-bold text-emerald-900 uppercase tracking-wider ml-1">
                    Notas de la visita
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-emerald-950 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none"
                    placeholder="Detalles importantes..."
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 animate-shake">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || preview.length === 0}
                  className="mt-2 w-full rounded-2xl bg-emerald-600 px-6 py-5 text-center text-xl font-black text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Finalizar y Cobrar'}
                </button>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
