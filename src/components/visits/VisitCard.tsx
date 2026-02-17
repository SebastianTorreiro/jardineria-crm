import { MapPin, User, Clock } from 'lucide-react'
import { formatLocalDate } from '@/utils/date-helpers'

interface VisitCardProps {
  visit: any
}

export function VisitCard({ visit }: VisitCardProps) {
  // We lost time precision with the strict date fix, so we hide time or show a generic label for now.
  // Or we can just display the day of week to be helpful. 
  // User requested: "formatLocalDate(visit.scheduled_date, 'EEEE d de MMMM')" logic.
  // Let's use that for a nice display.
  const dateDisplay = visit.scheduled_date ? formatLocalDate(visit.scheduled_date, 'EEEE d') : '--'
  
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} className="text-green-600 font-bold" />
          <span className="font-medium text-gray-900 capitalize">
            {visit.start_time ? `${visit.start_time} | ` : ''}
            {dateDisplay}
          </span>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            visit.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : visit.status === 'canceled'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {visit.status === 'pending' ? 'Pendiente' : visit.status}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">{visit.properties?.clients?.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{visit.properties?.address}</span>
        </div>
        {visit.notes && (
          <p className="mt-2 text-sm text-gray-500 italic">
            📝 "{visit.notes}"
          </p>
        )}
      </div>
    </div>
  )
}
