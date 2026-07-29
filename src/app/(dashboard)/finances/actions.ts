'use server'

import {
    createExpenseService,
    getExpenses as getExpensesService
} from '@/lib/services/finance-service'
import { getSupabaseWithOrg } from '@/utils/supabase/session'
import { createSafeAction } from '@/lib/safe-action'
import { ExpenseSchema } from '@/lib/validations/schemas'
import { revalidatePath } from 'next/cache'

// Actions

export const createExpenseAction = createSafeAction(ExpenseSchema, async (data, ctx) => {
    await createExpenseService(ctx.supabase, ctx.orgId, data)

    revalidatePath('/finances')
    return { success: true, message: 'Gasto registrado correctamente' }
})


// export async function getFinancialSummary(month: number, year: number) {
//     const supabase = await createClient()
//     const organizationId = await getUserOrganization(supabase)
    
//     if (!organizationId) {
//         return {
//             totalRevenue: 0,
//             totalDirectExpenses: 0,
//             totalGeneralExpenses: 0,
//             netMargin: 0
//         }
//     }

//     const { summary } = await getMonthlyFinancialSummary(supabase, organizationId, month, year)
//     return summary
// }

// export async function getProfitDistributionSummary(month: number, year: number) {
//     const supabase = await createClient()
//     const organizationId = await getUserOrganization(supabase)
    
//     if (!organizationId) {
//         return []
//     }

//     const { payouts } = await getMonthlyFinancialSummary(supabase, organizationId, month, year)
//     return payouts
// }

export async function getExpenses(month: number, year: number) {
    const { supabase, organizationId, error } = await getSupabaseWithOrg()

    if (error) throw error

    if (!organizationId) return []

    return getExpensesService(supabase, organizationId, month, year)
}
