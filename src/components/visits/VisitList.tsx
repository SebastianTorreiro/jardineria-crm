import { VisitCard } from './VisitCard'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { parseLocalDate } from '@/utils/date-helpers'

interface VisitListProps {
  visits: any[]
  selectedDate: Date
}

export function VisitList({ visits, selectedDate }: VisitListProps) {
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

      {/* Section 1: Pending */}
      <h3 className="mb-3 font-bold text-gray-800">📅 Pendientes</h3>
      
      {pendingVisits.length === 0 ? (
         <div className="mb-8 flex flex-col items-center justify-center py-6 text-center text-gray-500 rounded-xl bg-gray-50 border border-dashed border-gray-200">
            <p className="text-sm">Nada pendiente por hoy. 🌿</p>
         </div>
      ) : (
        <div className="mb-8 flex flex-col gap-4">
          {pendingVisits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}

      {/* Section 2: Completed (Only if any exist) */}
      {completedVisits.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="mb-3 mt-6 font-bold text-gray-500 flex items-center gap-2">
                ✅ Completadas 
                <span className="text-xs font-normal text-gray-400">({completedVisits.length})</span>
            </h3>
            <div className="flex flex-col gap-4">
                {completedVisits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
                ))}
            </div>
        </div>
      )}
    </div>
  )
}
