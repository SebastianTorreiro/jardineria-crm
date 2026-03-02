import Link from 'next/link';
import { MessageCircle, User, MapPin } from 'lucide-react';

interface ClientCardProps {
  client: any;
}

export function ClientCard({ client }: ClientCardProps) {
  const primaryProperty = client?.properties?.[0];

  return (
    <div className="relative bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md flex items-center justify-between group">
      
      {/* El Enlace Invisible (Stretched Link) */}
      <Link 
        href={`/clients/${client.id}`} 
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`Ver detalles de ${client.name}`}
      />

      {/* Contenido Principal (Bloqueado para clics) */}
      <div className="relative z-10 flex flex-1 items-center gap-4 pointer-events-none">
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700 shrink-0">
          <User size={20} />
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors truncate">
            {client.name}
          </h3>
          {primaryProperty ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryProperty.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 pointer-events-auto inline-flex items-center gap-1.5 text-sm text-slate-500 mt-1 hover:text-emerald-700 transition-colors group/map"
              title="Ver en Google Maps"
            >
              <MapPin size={14} className="text-slate-400 shrink-0 group-hover/map:text-emerald-600 transition-colors" />
              <span className="truncate underline decoration-slate-300 underline-offset-2 group-hover/map:decoration-emerald-500">{primaryProperty.address}</span>
            </a>
          ) : (
            <div className="text-sm text-slate-500 mt-1">Sin dirección registrada</div>
          )}
        </div>
      </div>

      {/* Botón de WhatsApp (Habilitado para clics) */}
      {client.phone && (
        <a
          href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shrink-0 ml-4 pointer-events-auto"
          aria-label="Enviar WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
      )}
    </div>
  );
}