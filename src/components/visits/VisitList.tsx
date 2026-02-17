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

  return (
    <div className="pb-24">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Agenda del {format(selectedDate, "d 'de' MMMM", { locale: es })}
      </h2>
      
      {filteredVisits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 rounded-xl bg-white border border-dashed border-gray-200">
          <p>Nada programado.</p>
          <p className="text-sm">¡Día libre! 🌿</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredVisits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}
    </div>
  )
}
