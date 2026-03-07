import Link from 'next/link';
import { MessageCircle, User, MapPin } from 'lucide-react';
import { Database } from '@/types/database.types';

type ClientRow = Database['public']['Tables']['clients']['Row'];
type PropertyRow = Database['public']['Tables']['properties']['Row'];

interface ClientCardProps {
  client: ClientRow & {
    properties?: PropertyRow[];
  };
}

export function ClientCard({ client }: ClientCardProps) {
  const primaryProperty = client?.properties?.[0];

  return (
    <div className="relative bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border transition-all hover:shadow-md flex items-center justify-between group">
      
      {/* El Enlace Invisible (Stretched Link) */}
      <Link 
        href={`/clients/${client.id}`} 
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`Ver detalles de ${client.name}`}
      />

      {/* Contenido Principal (Bloqueado para clics) */}
      <div className="relative z-10 flex flex-1 items-center gap-4 pointer-events-none">
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-primary shrink-0">
          <User size={20} />
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors truncate">
            {client.name}
          </h3>
          {primaryProperty ? (
              <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryProperty.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 pointer-events-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground mt-1 hover:text-primary transition-colors group/map"
              title="Ver en Google Maps"
            >
              <MapPin size={14} className="text-muted-foreground shrink-0 group-hover/map:text-primary transition-colors" />
              <span className="truncate underline decoration-border underline-offset-2 group-hover/map:decoration-primary">{primaryProperty.address}</span>
            </a>
          ) : (
            <div className="text-sm text-muted-foreground mt-1">Sin dirección registrada</div>
          )}
        </div>
      </div>

      {/* Botón de WhatsApp (Habilitado para clics) */}
      {client.phone && (
        <a
          href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary hover:bg-accent transition-colors shrink-0 ml-4 pointer-events-auto"
          aria-label="Enviar WhatsApp"
        >
          <MessageCircle size={22} />
        </a>
      )}
    </div>
  );
}