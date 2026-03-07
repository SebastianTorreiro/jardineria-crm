import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function getDashboardMetrics(supabase: SupabaseClient<Database>, organizationId: string) {
    const today = new Date().toISOString().split('T')[0]
    const firstDayOfMonth = startOfMonth(new Date()).toISOString()
    const lastDayOfMonth = endOfMonth(new Date()).toISOString()

    const [clientsCount, visitsTodayCount, monthlyIncome, todayVisits, lowStockSupplies] = await Promise.all([
        supabase
            .from('clients')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', organizationId),

        supabase
            .from('visits')
            .select('id', { count: 'exact', head: true })
            .eq('organization_id', organizationId)
            .gte('scheduled_date', `${today}T00:00:00.000Z`)
            .lte('scheduled_date', `${today}T23:59:59.999Z`)
            .neq('status', 'canceled'),

        supabase
            .from('visits')
            .select('real_income')
            .eq('organization_id', organizationId)
            .eq('status', 'completed')
            .gte('scheduled_date', firstDayOfMonth)
            .lte('scheduled_date', lastDayOfMonth),

        supabase
            .from('visits')
            .select(`
                id,
                scheduled_date,
                start_time,
                estimated_duration_mins,
                status,
                notes,
                notes_after_visit,
                total_price,
                properties (
                    address,
                    clients ( name )
                )
            `)
            .eq('organization_id', organizationId)
            .gte('scheduled_date', `${today}T00:00:00.000Z`)
            .lte('scheduled_date', `${today}T23:59:59.999Z`)
            .neq('status', 'canceled')
            .order('start_time', { ascending: true }), 

        supabase
            .from('supplies')
            .select('*')
            .eq('organization_id', organizationId)
    ]);

    const totalClients = clientsCount.count ?? 0
    const totalVisitsToday = visitsTodayCount.count ?? 0
    const totalIncome = monthlyIncome.data?.reduce((sum, visit) => sum + (visit.real_income || 0), 0) ?? 0
    const alerts = lowStockSupplies.data?.filter(s => s.current_stock < s.min_stock) || []

    return {
        totalClients,
        totalVisitsToday,
        totalIncome,
        todayVisits: todayVisits.data || [],
        alerts
    }
}
