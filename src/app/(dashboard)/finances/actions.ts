'use server'

import { createClient } from '@/utils/supabase/server'
import { getUserOrganization } from '@/utils/supabase/queries'
import { revalidatePath } from 'next/cache'
import { createSafeAction } from '@/lib/safe-action'
import { ExpenseSchema } from '@/lib/validations/schemas'
import { 
    getMonthlyFinancialSummary,
    createExpenseService,
    getExpenses as getExpensesService
} from '@/lib/services/finance-service'
import { Database } from '@/types/database.types'

// Actions

async export const createExpenseAction = ( 
    organizationId: string,
    data: {
    description?: string | null;
    amount: number;
    date: string;
    category: "fuel" | "equipment" | "maintenance" | "other";
  }) => {{
    try {
        await createExpenseService(
            data,
        organizationId)
    } catch (error) {
        console.error('Error creating expense:', error)
        return { success: false, message: 'Error al registrar el gasto. Intente nuevamente.' }
    }

    revalidatePath('/finances')
    return { success: true, message: 'Gasto registrado correctamente' }
}


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
    const supabase = await createClient()
    const organizationId = await getUserOrganization(supabase)

    if (!organizationId) return []

    return getExpensesService(supabase, organizationId, month, year)
}
