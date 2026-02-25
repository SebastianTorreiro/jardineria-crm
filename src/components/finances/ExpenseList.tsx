import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Expense {
  id: string
  created_at: string
  description: string | null
  amount: number
  date: string
  category: string
}

interface ExpenseListProps {
  expenses: Expense[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Insumos': 'bg-blue-100 text-blue-800',
  'Combustible': 'bg-orange-100 text-orange-800',
  'Comida': 'bg-yellow-100 text-yellow-800',
  'Mantenimiento': 'bg-gray-100 text-gray-800',
  'Otros': 'bg-purple-100 text-purple-800',
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
        <p className="text-gray-500">No hay gastos registrados en este período.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* Desktop View */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descripción</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoría</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Monto</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">
                {format(new Date(expense.date + 'T12:00:00'), 'dd MMM', { locale: es })}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                {expense.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[expense.category] || 'bg-slate-100 text-slate-800'}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                ${expense.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider mb-2 ${CATEGORY_COLORS[expense.category] || 'bg-slate-100 text-slate-800'}`}>
                  {expense.category}
                </span>
                <p className="text-sm font-medium text-slate-900 leading-snug break-words">
                  {expense.description}
                </p>
                <p className="text-xs text-slate-500 mt-1 capitalize">
                  {format(new Date(expense.date + 'T12:00:00'), 'dd MMM yyyy', { locale: es })}
                </p>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 ml-4 flex-shrink-0">
                <p className="text-base font-black text-slate-900 tracking-tight">
                  ${expense.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
