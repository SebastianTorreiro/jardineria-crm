import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { redirect } from 'next/navigation'
import { getDashboardMetrics } from '@/lib/services/dashboard-service'
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  Briefcase, 
  Receipt,
  AlertTriangle 
} from 'lucide-react'
import Link from 'next/link'
import { VisitCard } from '@/components/visits/VisitCard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const organizationId = await getUserOrganization(supabase)

  // Onboarding Check
  if (!organizationId) {
      redirect('/onboarding')
  }

  const { data: { user } } = await supabase.auth.getUser()
  const userName = user?.user_metadata?.name?.split(' ')[0] || 'Usuario'

  // Fetch Dashboard Metrics through Service Layer
  const metrics = await getDashboardMetrics(supabase, organizationId)

  return (
    <div className="flex flex-col gap-8 p-4 pb-24 md:p-8 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Hola, {userName}. Aquí tienes un resumen de hoy.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Clientes</h3>
            <Users className="h-4 w-4 text-muted-foreground/70" />
          </div>
          <div className="text-2xl font-bold text-foreground">{metrics.totalClients}</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Visitas Hoy</h3>
            <CalendarDays className="h-4 w-4 text-muted-foreground/70" />
          </div>
          <div className="text-2xl font-bold text-foreground">{metrics.totalVisitsToday}</div>
          <p className="text-xs text-muted-foreground">Programadas para hoy</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Ingresos (Mes)</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground/70" />
          </div>
          <div className="text-2xl font-bold text-foreground">${metrics.totalIncome.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Visitas completadas este mes</p>
        </div>
      </div>
    
      <div className="grid gap-8 md:grid-cols-2">
          {/* Today's Agenda */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Agenda de Hoy
              </h2>
              <div className="space-y-4">
                  {metrics.todayVisits && metrics.todayVisits.length > 0 ? (
                      metrics.todayVisits.map((visit: any) => (
                          <VisitCard key={visit.id} visit={visit} />
                      ))
                  ) : (
                      <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-xl bg-accent">
                          <p className="font-medium">No hay visitas agendadas para hoy.</p>
                          <p className="text-sm mt-1">¡Día de descanso o mantenimiento!</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Low Stock Alerts */}
          {metrics.alerts.length > 0 && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Alerta de Stock Bajo
                  </h2>
                  <div className="space-y-3">
                      {metrics.alerts.map((supply) => (
                          <div key={supply.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm border border-destructive/20">
                              <span className="font-medium text-foreground">{supply.name}</span>
                              <div className="text-sm">
                                  <span className="font-bold text-destructive">{supply.current_stock} {supply.unit}</span>
                                  <span className="text-muted-foreground mx-1">/</span>
                                  <span className="text-muted-foreground">Mín: {supply.min_stock}</span>
                              </div>
                          </div>
                      ))}
                    <div className="mt-4 text-center">
                        <Link href="/inventory" className="text-sm font-medium text-destructive hover:opacity-80 underline underline-offset-4">
                            Gestionar Inventario
                        </Link>
                    </div>
                  </div>
              </div>
          )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Link href="/visits?new=true" className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-accent p-6 transition-all hover:bg-card hover:border-border hover:shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                    <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium text-center text-sm text-foreground">Nueva Visita</span>
            </Link>

            <Link href="/finances?new=true" className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-accent p-6 transition-all hover:bg-card hover:border-border hover:shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                    <Receipt className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium text-center text-sm text-foreground">Registrar Gasto</span>
            </Link>

            <Link href="/clients?new=true" className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-accent p-6 transition-all hover:bg-card hover:border-border hover:shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                    <Users className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium text-center text-sm text-foreground">Agregar Cliente</span>
            </Link>

             <Link href="/inventory" className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-accent p-6 transition-all hover:bg-card hover:border-border hover:shadow-sm">
                <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                    <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <span className="font-medium text-center text-sm text-foreground">Inventario</span>
            </Link>
        </div>
      </div>
    </div>
  )
}
