
import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { startOfMonth, endOfMonth } from 'date-fns'
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  Plus, 
  Briefcase, 
  Receipt,
  AlertTriangle 
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)

  if (!organizationId) {
      return <div className="p-8">Error: No se encontró la organización.</div>
  }

  // 1. Fetch Stats in Parallel
  const today = new Date().toISOString().split('T')[0]
  const firstDayOfMonth = startOfMonth(new Date()).toISOString()
  const lastDayOfMonth = endOfMonth(new Date()).toISOString()

  const [clientsCount, visitsTodayCount, monthlyIncome, todayVisits, lowStockSupplies] = await Promise.all([
    // Total Clients
    supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organizationId),

    // Visits Today Count
    supabase
      .from('visits')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('scheduled_date', today)
      .neq('status', 'canceled'),

    // Monthly Income
    supabase
      .from('visits')
      .select('real_income')
      .eq('organization_id', organizationId)
      .eq('status', 'completed')
      .gte('scheduled_date', firstDayOfMonth)
      .lte('scheduled_date', lastDayOfMonth),

    // Today's Visits (Details)
    supabase
      .from('visits')
      .select(`
          id,
          scheduled_date,
          status,
          properties (
              address,
              clients ( name )
          )
      `)
      .eq('organization_id', organizationId)
      .eq('scheduled_date', today)
      .neq('status', 'canceled')
      .order('id', { ascending: true }), 

    // Low Stock Alert (Fetch all and filter in JS)
    supabase
      .from('supplies')
      .select('*')
      .eq('organization_id', organizationId)
  ])

  const totalClients = clientsCount.count ?? 0
  const totalVisitsToday = visitsTodayCount.count ?? 0
  const totalIncome = monthlyIncome.data?.reduce((sum, visit) => sum + (visit.real_income || 0), 0) ?? 0
  
  // Filter Low Stock in Logic (MVP optimization)
  const alerts = lowStockSupplies.data?.filter(s => s.current_stock < s.min_stock) || []

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Bienvenido a Jardinería CRM. Aquí tienes un resumen de hoy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Clientes</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{totalClients}</div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-500">Visitas Hoy</h3>
            <CalendarDays className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{totalVisitsToday}</div>
          <p className="text-xs text-gray-500">Programadas para hoy</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-500">Ingresos (Mes)</h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
          <p className="text-xs text-gray-500">Visitas completadas este mes</p>
        </div>
      </div>
    
      <div className="grid gap-8 md:grid-cols-2">
          {/* Today's Agenda */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  Agenda de Hoy
              </h2>
              <div className="space-y-4">
                  {todayVisits.data && todayVisits.data.length > 0 ? (
                      todayVisits.data.map((visit: any) => (
                          <div key={visit.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                              <div>
                                  <p className="font-medium text-gray-900">{visit.properties?.clients?.name || 'Sin asignar'}</p>
                                  <p className="text-sm text-gray-500">{visit.properties?.address || 'Sin asignar'}</p>
                              </div>
                              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  visit.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  visit.status === 'pending' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                  {visit.status === 'pending' ? 'Pendiente' : visit.status === 'completed' ? 'Completada' : visit.status}
                              </span>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-6 text-gray-500">
                          <p>No hay visitas agendadas para hoy.</p>
                          <p className="text-sm">¡Día de descanso o mantenimiento!</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Low Stock Alerts */}
          {alerts.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Alerta de Stock Bajo
                  </h2>
                  <div className="space-y-3">
                      {alerts.map((supply) => (
                          <div key={supply.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-red-100">
                              <span className="font-medium text-gray-900">{supply.name}</span>
                              <div className="text-sm">
                                  <span className="font-bold text-red-600">{supply.current_stock} {supply.unit}</span>
                                  <span className="text-gray-400 mx-1">/</span>
                                  <span className="text-gray-500">Mín: {supply.min_stock}</span>
                              </div>
                          </div>
                      ))}
                    <div className="mt-4 text-center">
                        <Link href="/inventory" className="text-sm font-medium text-red-700 hover:text-red-900 underline">
                            Gestionar Inventario
                        </Link>
                    </div>
                  </div>
              </div>
          )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
            <Link href="/visits?new=true" className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:bg-gray-100">
                <div className="rounded-full bg-blue-100 p-3 group-hover:bg-blue-200">
                    <CalendarDays className="h-6 w-6 text-blue-700" />
                </div>
                <span className="font-medium text-gray-900">Nueva Visita</span>
            </Link>

            <Link href="/finances?new=true" className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:bg-gray-100">
                <div className="rounded-full bg-green-100 p-3 group-hover:bg-green-200">
                    <Receipt className="h-6 w-6 text-green-700" />
                </div>
                <span className="font-medium text-gray-900">Registrar Gasto</span>
            </Link>

            <Link href="/clients?new=true" className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:bg-gray-100">
                <div className="rounded-full bg-purple-100 p-3 group-hover:bg-purple-200">
                    <Users className="h-6 w-6 text-purple-700" />
                </div>
                <span className="font-medium text-gray-900">Agregar Cliente</span>
            </Link>
        </div>
      </div>
    </div>
  )
}
