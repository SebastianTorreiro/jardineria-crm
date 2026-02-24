'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { ExpenseSchema } from '@/lib/validations/schemas'
import { getMonthlyFinancialSummary } from '@/lib/services/finance-service'

// Actions

export const createExpense = createSafeAction(ExpenseSchema, async (data, ctx) => {
    const { error } = await ctx.supabase
        .from('expenses')
        .insert({
            organization_id: ctx.orgId,
            description: data.description,
            amount: data.amount,
            date: data.date,
            category: data.category as any, // Cast to match DB enum if needed
        })

    if (error) {
        console.error('Error creating expense:', error)
        return { success: false, message: 'Error al registrar el gasto. Intente nuevamente.' }
    }

    revalidatePath('/finances')
    return { success: true, message: 'Gasto registrado correctamente' }
})

// Data Dispatchers
export async function getFinancialSummary(month: number, year: number) {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)
    
    if (!organizationId) {
        return {
            totalRevenue: 0,
            totalDirectExpenses: 0,
            totalGeneralExpenses: 0,
            netMargin: 0
        }
    }

    const { summary } = await getMonthlyFinancialSummary(supabase, organizationId, month, year)
    return summary
}

export async function getProfitDistributionSummary(month: number, year: number) {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)
    
    if (!organizationId) {
        return []
    }

    const { payouts } = await getMonthlyFinancialSummary(supabase, organizationId, month, year)
    return payouts
}

export async function getExpenses(month: number, year: number) {
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)

    if (!organizationId) return []

    const startDate = new Date(year, month, 1).toISOString()
    const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

    const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

    return data || []
}
