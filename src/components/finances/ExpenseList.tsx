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
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(expense.date + 'T12:00:00'), 'dd MMM', { locale: es })}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {expense.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[expense.category] || 'bg-gray-100 text-gray-800'}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                ${expense.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
