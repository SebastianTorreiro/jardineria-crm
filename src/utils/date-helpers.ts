import { parse, format } from 'date-fns'
import { es } from 'date-fns/locale'

// Recibe "2023-10-23", devuelve Date en medianoche LOCAL
export const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date()
  // Forzamos que interprete el string como año, mes, día local
  // parse('2023-10-23', 'yyyy-MM-dd', new Date()) creates a date at local midnight
  return parse(dateStr, 'yyyy-MM-dd', new Date())
}

// Usar esto para mostrar fechas en la UI
export const formatLocalDate = (dateStr: string, pattern: string = 'PPP') => {
   const date = parseLocalDate(dateStr)
   return format(date, pattern, { locale: es })
}
