'use client'

import { DayPicker } from 'react-day-picker'
import { es } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import clsx from 'clsx'

interface CalendarProps {
  selectedDate: Date
  onSelect: (date: Date) => void
  datesWithVisits: Date[]
}

export function Calendar({ selectedDate, onSelect, datesWithVisits }: CalendarProps) {
  return (
    <div className="flex justify-center rounded-xl bg-white p-4 shadow-sm">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelect(date)}
        locale={es}
        modifiers={{
          hasVisit: datesWithVisits,
        }}
        modifiersClassNames={{
          hasVisit: 'after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-green-500 after:rounded-full',
          selected: 'bg-green-600 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white',
        }}
        styles={{
          head_cell: { width: '40px', color: '#6b7280' },
          cell: { width: '40px' },
          day: { margin: 'auto', borderRadius: '8px' }, // Fix button style
        }}
        classNames={{
             caption: 'flex justify-center py-2 relative items-center',
             caption_label: 'text-sm font-medium text-gray-900',
             nav: 'flex items-center',
             nav_button: 'h-7 w-7 bg-transparent hover:bg-gray-50 p-1 rounded-md text-gray-500 transition-colors',
             nav_button_previous: 'absolute left-1',
             nav_button_next: 'absolute right-1',
             head_row: 'flex',
             row: 'flex w-full mt-2',
        }}
      />
    </div>
  )
}
