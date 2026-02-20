'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { startOfMonth, endOfMonth, setMonth, setYear, format } from 'date-fns'
import { Database } from '@/types/database.types'
import { createSafeAction } from '@/lib/safe-action'
import { ExpenseSchema, ExpenseInput } from '@/lib/validations/schemas'
import { getUserOrganization } from '@/utils/supabase/queries'

export type Expense = ExpenseInput & { id: string, org_id: string }

export const createExpense = createSafeAction(ExpenseSchema, async (data, ctx) => {
  const { error } = await ctx.supabase.from('expenses').insert({
    description: data.description,
    amount: data.amount,
    date: data.date,
    category: data.category as Database['public']['Enums']['expense_category'],
    organization_id: ctx.orgId,
  })

  if (error) throw error

  revalidatePath('/finances')
  return { success: true, message: 'Gasto registrado correctamente' }
})

export async function getFinancialSummary(month: number, year: number) {
  const supabase = await createClient()
  const orgId = await getUserOrganization(supabase)

  if (!orgId) return null

  // Calculate Date Range
  const baseDate = setYear(setMonth(new Date(), month), year)
  const startDate = startOfMonth(baseDate)
  const endDate = endOfMonth(baseDate)

  const startIso = format(startDate, 'yyyy-MM-dd')
  const endIso = format(endDate, 'yyyy-MM-dd')

  // 1. Get Income (Visits completed in this range)
  const { data: visits, error: visitsError } = await supabase
    .from('visits')
    .select('real_income')
    .eq('organization_id', orgId)
    .eq('status', 'completed')
    .gte('scheduled_date', startIso)
    .lte('scheduled_date', endIso)

  if (visitsError) {
    console.error('Error fetching income:', visitsError)
    return null
  }

  const totalIncome = visits.reduce((sum, v) => sum + (Number(v.real_income) || 0), 0)

  // 2. Get Expenses
  const { data: expenses, error: expensesError } = await supabase
    .from('expenses')
    .select('amount')
    .eq('organization_id', orgId)
    .gte('date', startIso)
    .lte('date', endIso)

  if (expensesError) {
    console.error('Error fetching expenses:', expensesError)
    return null
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses
  }
}

export async function getExpenses(month: number, year: number) {
  const supabase = await createClient()
  const orgId = await getUserOrganization(supabase)

  if (!orgId) return []

  const baseDate = setYear(setMonth(new Date(), month), year)
  const startDate = startOfMonth(baseDate)
  const endDate = endOfMonth(baseDate)

  const startIso = format(startDate, 'yyyy-MM-dd')
  const endIso = format(endDate, 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('organization_id', orgId)
    .gte('date', startIso)
    .lte('date', endIso)
    .order('date', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
}
