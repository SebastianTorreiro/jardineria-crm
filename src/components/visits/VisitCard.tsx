import { MapPin, User, Clock, Edit2, Trash2, CalendarDays } from 'lucide-react'
import { formatLocalDate } from '@/utils/date-helpers'
import { CompleteVisitDrawer } from './CompleteVisitDrawer'
import { EditVisitDrawer } from './EditVisitDrawer'
import { DeleteVisitDrawer } from './DeleteVisitDrawer'
import { Database } from '@/types/database.types'

type VisitRow = Database['public']['Tables']['visits']['Row']
type PropertyRow = Database['public']['Tables']['properties']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']

export type ExpandedVisit = VisitRow & {
  properties?: (PropertyRow & { clients?: ClientRow | null }) | null
}

interface VisitCardProps {
  visit: ExpandedVisit
}

export function VisitCard({ visit }: VisitCardProps) {
  // We lost time precision with the strict date fix, so we hide time or show a generic label for now.
  // Or we can just display the day of week to be helpful. 
  // User requested: "formatLocalDate(visit.scheduled_date, 'EEEE d de MMMM')" logic.
  // Let's use that for a nice display.
  const dateDisplay = visit.scheduled_date ? formatLocalDate(visit.scheduled_date, 'EEEE d') : '--'
  
  const timeStr = visit.start_time || 'Sin horario'
  const durationMins = visit.estimated_duration_mins || 60
  
  const isCompleted = visit.status === 'completed'
  const cardStyle = isCompleted 
    ? "flex items-start gap-3 rounded-xl bg-secondary p-4 shadow-sm border border-primary/20 opacity-90"
    : "flex items-start gap-3 rounded-xl bg-card text-card-foreground p-4 shadow-sm border border-border"

  const [mainNote, closingNote] = visit.notes ? visit.notes.split('[Cierre]:') : [visit.notes, null]

  return (
    <div className={cardStyle}>
      {/* Time Column (Badge) */}
      <div className="flex flex-col items-center justify-center w-[72px] rounded-lg bg-accent py-3 border border-border text-foreground shrink-0">
          <span className="text-[17px] font-black tracking-tight">{timeStr}</span>
          {timeStr !== 'Sin horario' && (
             <span className="text-[10px] font-bold tracking-wider uppercase opacity-80 mt-0.5">{durationMins} min</span>
          )}
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays size={14} className="text-muted-foreground/70" />
            <span className="font-medium text-foreground capitalize">
              {dateDisplay}
            </span>
          </div>

        {visit.status === 'pending' ? (
            <div className="flex items-center gap-2">
                <EditVisitDrawer visit={visit}>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground border border-border shadow-sm hover:bg-accent hover:text-primary transition-colors" title="Editar">
                        <Edit2 size={15} />
                    </button>
                </EditVisitDrawer>
                <DeleteVisitDrawer visit={visit}>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground border border-border shadow-sm hover:bg-destructive/10 hover:text-destructive transition-colors" title="Eliminar">
                        <Trash2 size={15} />
                    </button>
                </DeleteVisitDrawer>
                <CompleteVisitDrawer visit={visit}>
                    <button className="inline-flex items-center rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-opacity text-sm h-8 ml-1">
                        ✅ Completar
                    </button>
                </CompleteVisitDrawer>
            </div>
        ) : (
            <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${
                isCompleted
                ? 'bg-primary/20 text-primary text-lg font-bold'
                : visit.status === 'canceled'
                ? 'bg-destructive/20 text-destructive text-xs'
                : 'bg-accent text-accent-foreground text-xs'
            }`}
            >
            {isCompleted ? `Cobrado: $${visit.total_price ?? '0'}` : visit.status}
            </span>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-foreground">{visit.properties?.clients?.name || 'Sin asignar'}</h3>
        {visit.properties?.address ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visit.properties.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group/map"
            title="Ver en Google Maps"
          >
            <MapPin size={14} className="group-hover/map:text-primary transition-colors shrink-0" />
            <span className="underline decoration-border underline-offset-2 group-hover/map:decoration-primary line-clamp-1">{visit.properties.address}</span>
          </a>
        ) : (
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} className="shrink-0" />
            <span>Sin asignar</span>
          </div>
        )}
        
        <div className="mt-3 w-full rounded-md bg-accent p-3 text-sm italic border border-border">
          {mainNote ? (
            <p className="text-foreground/80">📝 {mainNote.trim()}</p>
          ) : (
            <p className="text-muted-foreground">Sin observaciones previas</p>
          )}
        </div>
        
        {closingNote && (
           <div className="mt-2 w-full p-2 bg-secondary text-primary text-xs rounded border border-primary/20">
             🏁 Cierre: {closingNote.trim()}
           </div>
        )}
      </div>
      </div>
    </div>
  )
}
