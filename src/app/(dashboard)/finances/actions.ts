'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { ExpenseSchema } from '@/lib/validations/schemas'
import { 
    getMonthlyFinancialSummary,
    createExpense as createExpenseService,
    getExpenses as getExpensesService
} from '@/lib/services/finance-service'

// Actions

export const createExpense = createSafeAction(ExpenseSchema, async (data, ctx) => {
    try {
        await createExpenseService(ctx.supabase, ctx.orgId, {
            description: data.description,
            amount: data.amount,
            date: data.date,
            category: data.category as any,
        })
    } catch (error) {
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

    return getExpensesService(supabase, organizationId, month, year)
}
