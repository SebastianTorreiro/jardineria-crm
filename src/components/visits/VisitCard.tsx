import { MapPin, User, Clock } from 'lucide-react'
import { formatLocalDate } from '@/utils/date-helpers'
import { CompleteVisitDrawer } from './CompleteVisitDrawer'

interface VisitCardProps {
  visit: any
}

export function VisitCard({ visit }: VisitCardProps) {
  // We lost time precision with the strict date fix, so we hide time or show a generic label for now.
  // Or we can just display the day of week to be helpful. 
  // User requested: "formatLocalDate(visit.scheduled_date, 'EEEE d de MMMM')" logic.
  // Let's use that for a nice display.
  const dateDisplay = visit.scheduled_date ? formatLocalDate(visit.scheduled_date, 'EEEE d') : '--'
  
  const isCompleted = visit.status === 'completed'
  const cardStyle = isCompleted 
    ? "flex flex-col gap-2 rounded-xl bg-green-50 p-4 shadow-sm border border-green-300 opacity-80"
    : "flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm border border-gray-100"

  const [mainNote, closingNote] = visit.notes ? visit.notes.split('[Cierre]:') : [visit.notes, null]

  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} className="text-green-600 font-bold" />
          <span className="font-medium text-gray-900 capitalize">
            {visit.start_time ? `${visit.start_time} | ` : ''}
            {dateDisplay}
          </span>
        </div>

        {visit.status === 'pending' ? (
            <CompleteVisitDrawer visit={visit}>
                <button className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-green-700 shadow-sm ring-1 ring-inset ring-green-600 hover:bg-green-50">
                    ✅ Completar
                </button>
            </CompleteVisitDrawer>
        ) : (
            <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${
                isCompleted
                ? 'bg-green-100 text-green-700 text-lg font-bold' // Larger for completed
                : visit.status === 'canceled'
                ? 'bg-red-100 text-red-800 text-xs'
                : 'bg-yellow-100 text-yellow-800 text-xs'
            }`}
            >
            {isCompleted ? `Cobrado: $${visit.real_income ?? '0'}` : visit.status}
            </span>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">{visit.properties?.clients?.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{visit.properties?.address}</span>
        </div>
        
        {mainNote && (
          <p className="mt-2 text-sm text-gray-500 italic">
            📝 "{mainNote.trim()}"
          </p>
        )}
        
        {closingNote && (
           <div className="mt-2 p-2 bg-green-100 text-green-800 text-xs rounded border border-green-200">
             🏁 Cierre: {closingNote.trim()}
           </div>
        )}
      </div>
    </div>
  )
}
