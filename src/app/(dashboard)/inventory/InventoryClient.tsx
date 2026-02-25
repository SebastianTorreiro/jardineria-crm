'use client'

import { useState } from 'react'
import { Plus, PenTool, Package } from 'lucide-react'
import { updateToolStatus, updateSupplyStock, Tool, Supply } from './actions'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FloatingActionButton } from '@/components/ui/FloatingActionButton'
import { BaseDrawer } from '@/components/ui/BaseDrawer'
import { ToolForm } from '@/components/inventory/ToolForm'
import { SupplyForm } from '@/components/inventory/SupplyForm'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface InventoryClientProps {
    initialTools: Tool[]
    initialSupplies: Supply[]
}

export default function InventoryClient({ initialTools, initialSupplies }: InventoryClientProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'supplies'>('tools')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
           <p className="text-sm text-gray-500">Gestiona tus herramientas e insumos.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('tools')}
            className={cn(
              "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2",
               activeTab === 'tools'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            <PenTool className="h-4 w-4" />
            Herramientas
          </button>
          <button
            onClick={() => setActiveTab('supplies')}
            className={cn(
                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2",
                 activeTab === 'supplies'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
          >
            <Package className="h-4 w-4" />
            Insumos
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'tools' ? (
            <div className="pb-24">
                {/* Desktop View (Table) */}
                <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-6">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Herramienta</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Marca</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Estado / Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {initialTools.map((tool) => (
                                <tr key={tool.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900">{tool.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-500">{tool.brand || 'Sin marca'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                                                tool.status === 'ok' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                                                tool.status === 'service' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                                'bg-red-50 text-red-700 ring-red-600/20'
                                            )}>
                                                {tool.status === 'ok' ? 'Disponible' : tool.status === 'service' ? 'Mantenimiento' : 'Roto'}
                                            </span>
                                            <select 
                                                className="block rounded-md border-0 py-1 pl-3 pr-8 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-xs sm:leading-6 ml-auto"
                                                value={tool.status}
                                                onChange={async (e) => {
                                                    await updateToolStatus({ id: tool.id, status: e.target.value as any })
                                                }}
                                            >
                                                <option value="ok">Disponible</option>
                                                <option value="service">Mantenimiento</option>
                                                <option value="broken">Roto</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {initialTools.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-slate-500 bg-slate-50">
                                        No hay herramientas registradas. ¡Agrega la primera!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="grid grid-cols-1 gap-4 sm:hidden">
                {initialTools.map((tool) => (
                    <div key={tool.id} className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                                <span className={cn(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                    tool.status === 'ok' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                    tool.status === 'service' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                    'bg-red-50 text-red-700 ring-red-600/20'
                                )}>
                                    {tool.status === 'ok' ? 'Disponible' : tool.status === 'service' ? 'Mantenimiento' : 'Roto'}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{tool.brand || 'Sin marca'}</p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="text-xs font-medium text-gray-500 block mb-1">Cambiar Estado</label>
                            <select 
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-xs sm:leading-6"
                                value={tool.status}
                                onChange={async (e) => {
                                    await updateToolStatus({ id: tool.id, status: e.target.value as any })
                                    // Router will refresh automatically due to revalidatePath
                                }}
                            >
                                <option value="ok">Disponible</option>
                                <option value="service">Mantenimiento</option>
                                <option value="broken">Roto</option>
                            </select>
                        </div>
                    </div>
                ))}
                {initialTools.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        No hay herramientas registradas. ¡Agrega la primera!
                    </div>
                )}
                </div>
            </div>
        ) : (
            <div className="pb-24">
                {/* Desktop View (Table) */}
                <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm mb-6">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Insumo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Stock Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Mínimo</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {initialSupplies.map((supply) => (
                            <tr key={supply.id} className={cn("hover:bg-slate-50 transition-colors", supply.current_stock < supply.min_stock ? 'bg-red-50/50' : '')}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-semibold text-slate-900">{supply.name}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                                        supply.current_stock < supply.min_stock 
                                            ? 'bg-red-100 text-red-700 ring-red-600/20 shadow-sm' 
                                            : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                    )}>
                                        {supply.current_stock} {supply.unit}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                    {supply.min_stock} {supply.unit}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button 
                                        onClick={async () => {
                                            const val = prompt(`Actualizar stock de ${supply.name}:`, supply.current_stock.toString())
                                            if (val !== null) {
                                                const num = parseInt(val)
                                                if (!isNaN(num)) {
                                                    await updateSupplyStock({ id: supply.id, quantity: num })
                                                }
                                            }
                                        }}
                                        className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                                    >
                                        Actualizar
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {initialSupplies.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500 bg-slate-50">
                                    No hay insumos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
                {initialSupplies.map((supply) => (
                    <div key={supply.id} className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-lg">{supply.name}</h3>
                            <button 
                                onClick={async () => {
                                    const val = prompt(`Actualizar stock de ${supply.name}:`, supply.current_stock.toString())
                                    if (val !== null) {
                                        const num = parseInt(val)
                                        if (!isNaN(num)) {
                                            await updateSupplyStock({ id: supply.id, quantity: num })
                                        }
                                    }
                                }}
                                className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 transition-colors"
                            >
                                ✏️ Stock
                            </button>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 mb-1">Stock Actual</span>
                                <span className={cn(
                                    "inline-flex items-center justify-center rounded-lg px-3 py-1 text-sm font-bold ring-1 ring-inset",
                                    supply.current_stock < supply.min_stock 
                                        ? 'bg-red-50 text-red-700 ring-red-600/20' 
                                        : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                )}>
                                    {supply.current_stock} {supply.unit}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-slate-500 mb-1">Mínimo</span>
                                <span className="text-sm font-medium text-slate-700">
                                    {supply.min_stock} {supply.unit}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        )}
      </div>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <BaseDrawer 
        isOpen={isModalOpen} 
        onClose={setIsModalOpen} 
        title={activeTab === 'tools' ? 'Agregar Herramienta' : 'Agregar Insumo'}
      >
        {activeTab === 'tools' ? (
          <ToolForm 
            onSuccess={() => setIsModalOpen(false)} 
            onCancel={() => setIsModalOpen(false)} 
          />
        ) : (
          <SupplyForm 
            onSuccess={() => setIsModalOpen(false)} 
            onCancel={() => setIsModalOpen(false)} 
          />
        )}
      </BaseDrawer>
    </div>
  )
}