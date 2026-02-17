import { MessageCircle, User, MapPin } from 'lucide-react'

interface ClientCardProps {
  client: any
}

export function ClientCard({ client }: ClientCardProps) {
  const primaryProperty = client.properties?.[0]

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{client.name}</h3>
            {primaryProperty && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={14} />
                <span>{primaryProperty.address}</span>
              </div>
            )}
          </div>
        </div>
        {client.phone && (
          <a
            href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-green-200"
          >
            <MessageCircle size={20} />
          </a>
        )}
      </div>
    </div>
  )
}
