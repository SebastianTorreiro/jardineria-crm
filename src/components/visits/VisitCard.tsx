import { MapPin, User, Clock, Edit2, Trash2 } from 'lucide-react'
import { formatLocalDate } from '@/utils/date-helpers'
import { CompleteVisitDrawer } from './CompleteVisitDrawer'
import { EditVisitDrawer } from './EditVisitDrawer'
import { DeleteVisitDrawer } from './DeleteVisitDrawer'
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
    ? "flex flex-col gap-2 rounded-xl bg-emerald-50 p-4 shadow-sm border border-emerald-300 opacity-80"
    : "flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm border border-slate-200"

  const [mainNote, closingNote] = visit.notes ? visit.notes.split('[Cierre]:') : [visit.notes, null]

  return (
    <div className={cardStyle}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} className="text-emerald-600 font-bold" />
          <span className="font-medium text-gray-900 capitalize">
            {visit.start_time ? `${visit.start_time} | ` : ''}
            {dateDisplay}
          </span>
        </div>

        {visit.status === 'pending' ? (
            <div className="flex items-center gap-2">
                <EditVisitDrawer visit={visit}>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors" title="Editar">
                        <Edit2 size={15} />
                    </button>
                </EditVisitDrawer>
                <DeleteVisitDrawer visit={visit}>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 border border-slate-200 shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors" title="Eliminar">
                        <Trash2 size={15} />
                    </button>
                </DeleteVisitDrawer>
                <CompleteVisitDrawer visit={visit}>
                    <button className="inline-flex items-center rounded-full bg-white px-3 py-1 font-medium text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-600 hover:bg-emerald-50 text-sm h-8 ml-1">
                        ✅ Completar
                    </button>
                </CompleteVisitDrawer>
            </div>
        ) : (
            <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${
                isCompleted
                ? 'bg-emerald-100 text-emerald-800 text-lg font-bold' // Larger for completed
                : visit.status === 'canceled'
                ? 'bg-red-100 text-red-800 text-xs'
                : 'bg-yellow-100 text-yellow-800 text-xs'
            }`}
            >
            {isCompleted ? `Cobrado: $${visit.total_price ?? '0'}` : visit.status}
            </span>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">{visit.properties?.clients?.name || 'Sin asignar'}</h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{visit.properties?.address || 'Sin asignar'}</span>
        </div>
        
        {mainNote && (
          <p className="mt-2 text-sm text-gray-500 italic">
            📝 "{mainNote.trim()}"
          </p>
        )}
        
        {closingNote && (
           <div className="mt-2 p-2 bg-emerald-100 text-emerald-800 text-xs rounded border border-emerald-200">
             🏁 Cierre: {closingNote.trim()}
           </div>
        )}
      </div>
    </div>
  )
}
