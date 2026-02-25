import { ClientCard } from './ClientCard'

interface ClientListProps {
  clients: any[]
}

export function ClientList({ clients }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
        <p>No clients found.</p>
        <p className="text-sm">Tap the + button to add one.</p>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Desktop View */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dirección Principal</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Teléfono</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {clients.map((client) => {
              const primaryProperty = client.properties?.[0]
              return (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {primaryProperty ? primaryProperty.address : 'Sin asignar'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {client.phone ? (
                      <a 
                        href={`https://wa.me/${client.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        {client.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400">N/D</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
}
