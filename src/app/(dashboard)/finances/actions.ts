'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { startOfMonth, endOfMonth, setMonth, setYear, format } from 'date-fns'

export async function createExpense(formData: FormData) {
  const supabase = await createClient()

  // Get current user and organization
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Usuario no autenticado' }
  }

  // Get organization_id (assuming single org for now, or fetch from DB)
  // We can query the organization_members table
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return { error: 'No perteneces a ninguna organización' }
  }

  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string // YYYY-MM-DD
  const category = formData.get('category') as string

  if (!description || !amount || !date || !category) {
    return { error: 'Faltan campos obligatorios' }
  }

  const { error } = await supabase.from('expenses').insert({
    description,
    amount,
    date,
    category,
    organization_id: membership.organization_id,
  })

  if (error) {
    console.error('createExpense Error:', error)
    return { error: 'Error al crear el gasto' }
  }

  revalidatePath('/finances')
  return { success: true }
}

export async function getFinancialSummary(month: number, year: number) {
  const supabase = await createClient()
  
  // Get organization
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single()
    
  if (!membership) return null
  const orgId = membership.organization_id

  // Calculate Date Range
  // month is 0-indexed (0 = Jan) or 1-indexed? Usually in UI we assume 0..11 for JS Date, but lets standardize.
  // Let's assume input 'month' is 0-11 to match Date types, OR 1-12. 
  // Let's assume standard JS DategetMonth() (0-11).
  const baseDate = setYear(setMonth(new Date(), month), year)
  const startDate = startOfMonth(baseDate)
  const endDate = endOfMonth(baseDate)

  const startIso = format(startDate, 'yyyy-MM-dd')
  const endIso = format(endDate, 'yyyy-MM-dd')

  // 1. Get Income (Visits completed in this range)
  // Logic: Sum real_income
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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single()
    
  if (!membership) return []

  const baseDate = setYear(setMonth(new Date(), month), year)
  const startDate = startOfMonth(baseDate)
  const endDate = endOfMonth(baseDate)

  const startIso = format(startDate, 'yyyy-MM-dd')
  const endIso = format(endDate, 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('organization_id', membership.organization_id)
    .gte('date', startIso)
    .lte('date', endIso)
    .order('date', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
}
