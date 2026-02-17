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
    <div className="flex flex-col gap-4 pb-24">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  )
}
