import { VisitCard } from './VisitCard'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { parseLocalDate, formatLocalDate } from '@/utils/date-helpers'
import { CompleteVisitDrawer } from './CompleteVisitDrawer'
import { EditVisitDrawer } from './EditVisitDrawer'
import { DeleteVisitDrawer } from './DeleteVisitDrawer'
import { Edit2, Trash2 } from 'lucide-react'

import { Database } from '@/types/database.types'

type VisitRow = Database['public']['Tables']['visits']['Row']
type PropertyRow = Database['public']['Tables']['properties']['Row']
type ClientRow = Database['public']['Tables']['clients']['Row']

type ExpandedVisit = VisitRow & {
  properties?: (PropertyRow & { clients?: ClientRow | null }) | null
}

interface VisitListProps {
  visits: ExpandedVisit[]
  selectedDate: Date
  tab?: string
}

export function VisitList({ visits, selectedDate, tab = 'agenda' }: VisitListProps) {
  // Filter visits for selected date (client-side simple filter)
  const filteredVisits = visits.filter(visit => {
    const visitDate = parseLocalDate(visit.scheduled_date)
    return (
        visitDate.getDate() === selectedDate.getDate() &&
        visitDate.getMonth() === selectedDate.getMonth() &&
        visitDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  const pendingVisits = filteredVisits.filter(v => v.status === 'pending')
  const completedVisits = filteredVisits.filter(v => v.status === 'completed' || v.status === 'canceled')

  return (
    <div className="pb-24">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Agenda del {format(selectedDate, "d 'de' MMMM", { locale: es })}
      </h2>

      {/* Section 1: Pending (Agenda Tab) */}
      {tab === 'agenda' && (
        <>
          <h3 className="mb-3 font-bold text-gray-800">📅 Pendientes</h3>
          
          {pendingVisits.length === 0 ? (
             <div className="mb-8 flex flex-col items-center justify-center py-6 text-center text-muted-foreground rounded-xl bg-accent border border-dashed border-border">
                <p className="text-sm">Nada pendiente por hoy. 🌿</p>
             </div>
          ) : (
            <div className="mb-8">
                {/* Desktop View */}
                <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-accent text-accent-foreground">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dirección</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {pendingVisits.map((visit) => (
                                <tr key={visit.id} className="hover:bg-accent/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium capitalize">
                                        {visit.start_time ? `${visit.start_time} | ` : ''}
                                        {visit.scheduled_date ? formatLocalDate(visit.scheduled_date, 'EEEE d') : '--'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {visit.properties?.clients?.name || 'Sin asignar'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {visit.properties?.address || 'Sin asignar'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end gap-2">
                                            <EditVisitDrawer visit={visit}>
                                                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-accent hover:text-primary transition-colors" title="Editar">
                                                    <Edit2 size={14} />
                                                </button>
                                            </EditVisitDrawer>
                                            
                                            <DeleteVisitDrawer visit={visit}>
                                                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-destructive/10 hover:text-destructive transition-colors" title="Eliminar">
                                                    <Trash2 size={14} />
                                                </button>
                                            </DeleteVisitDrawer>

                                            <CompleteVisitDrawer visit={visit}>
                                                <button className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 transition-colors ml-2">
                                                    ✅ Completar
                                                </button>
                                            </CompleteVisitDrawer>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Mobile View */}
                <div className="grid grid-cols-1 gap-4 sm:hidden">
                  {pendingVisits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
                  ))}
                </div>
            </div>
          )}
        </>
      )}

      {/* Section 2: Completed (History Tab) */}
      {tab === 'history' && (
        <>
          <h3 className="mb-3 font-bold text-gray-800">📚 Historial</h3>
          
          {completedVisits.length === 0 ? (
             <div className="mb-8 flex flex-col items-center justify-center py-6 text-center text-muted-foreground rounded-xl bg-accent border border-dashed border-border">
                <p className="text-sm">No hay visitas en el historial para esta fecha. 🌿</p>
             </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="hidden sm:block overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm mt-4">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-accent text-accent-foreground">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado / Cobro</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {completedVisits.map((visit) => {
                                const isCompleted = visit.status === 'completed';
                                return (
                                    <tr key={visit.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium capitalize">
                                            {visit.start_time ? `${visit.start_time} | ` : ''}
                                            {visit.scheduled_date ? formatLocalDate(visit.scheduled_date, 'EEEE d') : '--'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {visit.properties?.clients?.name || 'Sin asignar'}
                                            <div className="text-xs text-muted-foreground font-normal">{visit.properties?.address || 'Sin asignar'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${isCompleted ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                                                {isCompleted ? `Cobrado: $${visit.total_price ?? '0'}` : 'Cancelada'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:hidden mt-4">
                    {completedVisits.map((visit) => (
                        <VisitCard key={visit.id} visit={visit} />
                    ))}
                </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
