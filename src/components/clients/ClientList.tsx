import { ClientCard } from './ClientCard'

interface ClientListProps {
  clients: any[]
}

export function ClientList({ clients }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
        <p>No hay clientes registrados.</p>
        <p className="text-sm">Toca el botón + para agregar uno.</p>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Grilla Unificada Responsiva: 
        1 columna en móvil, 2 en tablets, 3 en PC. 
        Usamos ClientCard (la única fuente de la verdad) para TODAS las pantallas.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
}