import { MessageCircle, User, MapPin } from 'lucide-react'

interface ClientCardProps {
  client: any
}

export function ClientCard({ client }: ClientCardProps) {
  const primaryProperty = client.properties?.[0]

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{client.name}</h3>
            {primaryProperty && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                <MapPin size={14} className="text-slate-400" />
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
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform hover:bg-emerald-200 active:scale-95 shadow-sm"
          >
            <MessageCircle size={24} />
          </a>
        )}
      </div>
    </div>
  )
}
