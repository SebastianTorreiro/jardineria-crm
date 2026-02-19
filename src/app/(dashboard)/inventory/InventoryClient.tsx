'use client'

import { useState } from 'react'
import { Plus, PenTool, Package } from 'lucide-react'
import { createTool, createSupply, updateToolStatus, updateSupplyStock, getTools, getSupplies, Tool, Supply } from './actions'

interface InventoryClientProps {
    initialTools: Tool[]
    initialSupplies: Supply[]
}

export default function InventoryClient({ initialTools, initialSupplies }: InventoryClientProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'supplies'>('tools')
  
  const [tools, setTools] = useState<Tool[]>(initialTools)
  const [supplies, setSupplies] = useState<Supply[]>(initialSupplies)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function refreshData() {
    setIsLoading(true)
    setError(null)
    if (activeTab === 'tools') {
      const data = await getTools()
      setTools(data)
    } else {
      const data = await getSupplies()
      setSupplies(data)
    }
    setIsLoading(false)
  }

  const handleCreate = async (formData: FormData) => {
      setIsModalOpen(false)
      setIsLoading(true)
      setError(null)
      
      let result;
      if (activeTab === 'tools') {
          result = await createTool(formData)
      } else {
          result = await createSupply(formData)
      }

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else {
        await refreshData()
      }
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
           <p className="text-sm text-gray-500">Gestiona tus herramientas e insumos.</p>
        </div>
        <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
        >
            <Plus className="h-4 w-4" />
            {activeTab === 'tools' ? 'Nueva Herramienta' : 'Nuevo Insumo'}
        </button>
      </div>

       {/* Error Message */}
       {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => { setActiveTab('tools'); setError(null); }}
            className={`${
              activeTab === 'tools'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2`}
          >
            <PenTool className="h-4 w-4" />
            Herramientas
          </button>
          <button
            onClick={() => { setActiveTab('supplies'); setError(null); }}
            className={`${
              activeTab === 'supplies'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2`}
          >
            <Package className="h-4 w-4" />
            Insumos
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
            <div className="flex h-40 items-center justify-center text-gray-500">
                Cargando...
            </div>
        ) : activeTab === 'tools' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => (
                    <div key={tool.id} className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                    tool.status === 'ok' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                    tool.status === 'service' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                    'bg-red-50 text-red-700 ring-red-600/20'
                                }`}>
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
                                    setIsLoading(true)
                                    setError(null)
                                    const result = await updateToolStatus(tool.id, e.target.value as any)
                                    if(result.error) {
                                        setError(result.error)
                                        setIsLoading(false)
                                    } else {
                                        await refreshData()
                                    }
                                }}
                            >
                                <option value="ok">Disponible</option>
                                <option value="service">Mantenimiento</option>
                                <option value="broken">Roto</option>
                            </select>
                        </div>
                    </div>
                ))}
                {tools.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        No hay herramientas registradas. ¡Agrega la primera!
                    </div>
                )}
            </div>
        ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Insumo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Mínimo</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {supplies.map((supply) => (
                            <tr key={supply.id} className={supply.current_stock < supply.min_stock ? 'bg-red-50' : ''}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{supply.name}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                        supply.current_stock < supply.min_stock 
                                            ? 'bg-red-100 text-red-700 ring-red-600/10' 
                                            : 'bg-green-100 text-green-700 ring-green-600/10'
                                    }`}>
                                        {supply.current_stock} {supply.unit}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {supply.min_stock} {supply.unit}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <button 
                                        onClick={async () => {
                                            const val = prompt(`Actualizar stock de ${supply.name}:`, supply.current_stock.toString())
                                            if (val !== null) {
                                                const num = parseInt(val)
                                                if (!isNaN(num)) {
                                                    setIsLoading(true)
                                                    setError(null)
                                                    const result = await updateSupplyStock(supply.id, num)
                                                    if(result.error) {
                                                        setError(result.error)
                                                        setIsLoading(false)
                                                    } else {
                                                        await refreshData()
                                                    }
                                                }
                                            }
                                        }}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        Actualizar
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {supplies.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 bg-gray-50">
                                    No hay insumos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 transition-all">
              <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      {activeTab === 'tools' ? 'Agregar Herramienta' : 'Agregar Insumo'}
                  </h3>
                  
                  <form action={handleCreate}>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700">Nombre</label>
                              <input 
                                name="name" 
                                required 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3 border" 
                              />
                          </div>
                          {/* Rest of the form inputs remain the same... */}
                          {activeTab === 'tools' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Marca</label>
                                    <input 
                                        name="brand" 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3 border" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado Inicial</label>
                                    <select 
                                        name="status" 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3 border"
                                    >
                                        <option value="ok">Disponible</option>
                                        <option value="service">En Mantenimiento</option>
                                        <option value="broken">Roto</option>
                                    </select>
                                </div>
                            </>
                          ) : (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock Actual</label>
                                        <input 
                                            name="current_stock" 
                                            type="number" 
                                            required 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3 border" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Unidad (ej. L, Kg)</label>
                                        <input 
                                            name="unit" 
                                            required 
                                            defaultValue="unidades"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3 border" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Alerta Stock Mínimo</label>
                                    <input 
                                        name="min_stock" 
                                        type="number" 
                                        required 
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-2 px-3 border" 
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Se mostrará una alerta si el stock baja de este número.</p>
                                </div>
                              </>
                          )}
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                          <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                              Cancelar
                          </button>
                          <button 
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                              Guardar
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  )
}