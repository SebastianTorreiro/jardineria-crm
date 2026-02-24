import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export interface MonthlyFinancialSummary {
    totalRevenue: number
    totalDirectExpenses: number
    totalGeneralExpenses: number
    netMargin: number
}

export interface PartnerPayoutSummary {
    worker_id: string
    worker_name: string
    total_amount: number
}

export async function getMonthlyFinancialSummary(
    supabase: SupabaseClient<Database>,
    organizationId: string,
    month: number, // 0-11
    year: number
): Promise<{ summary: MonthlyFinancialSummary, payouts: PartnerPayoutSummary[] }> {
    
    const startDate = new Date(year, month, 1).toISOString()
    const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

    // 1. Fetch Completed Visits (Revenue + Direct Expenses)
    const { data: visits } = await supabase
        .from('visits')
        .select('total_price, direct_expenses')
        .eq('organization_id', organizationId)
        .eq('status', 'completed')
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate) as { data: any[] | null, error: any }

    let totalRevenue = 0
    let totalDirectExpenses = 0

    if (visits) {
        visits.forEach(v => {
            totalRevenue += v.total_price || 0
            totalDirectExpenses += v.direct_expenses || 0
        })
    }

    // 2. Fetch General Expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('organization_id', organizationId)
        .gte('date', startDate)
        .lte('date', endDate)

    let totalGeneralExpenses = 0
    if (expenses) {
        totalGeneralExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    }

    // 3. Fetch Payouts (Partner distribution)
    const { data: payouts } = await supabase
        .from('payouts')
        .select(`
            amount,
            worker_id,
            workers!inner (
                name
            )
        `)
        .eq('organization_id', organizationId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)

    const payoutsMap = new Map<string, PartnerPayoutSummary>()

    if (payouts) {
        for (const p of payouts) {
            // @ts-ignore - Supabase join typing workaround
            const workerName = p.workers?.name || 'Unknown'
            
            const existing = payoutsMap.get(p.worker_id)
            if (existing) {
                existing.total_amount += Number(p.amount)
            } else {
                payoutsMap.set(p.worker_id, {
                    worker_id: p.worker_id,
                    worker_name: workerName,
                    total_amount: Number(p.amount)
                })
            }
        }
    }

    const netMargin = totalRevenue - totalDirectExpenses - totalGeneralExpenses

    return {
        summary: {
            totalRevenue,
            totalDirectExpenses,
            totalGeneralExpenses,
            netMargin
        },
        payouts: Array.from(payoutsMap.values()).sort((a, b) => b.total_amount - a.total_amount)
    }
}
