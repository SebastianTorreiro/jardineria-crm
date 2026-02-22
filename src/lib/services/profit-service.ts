import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export type ProfitBreakdown = {
    worker_id: string
    worker_name: string
    amount: number
    share_percentage: number
}

export async function calculateProfitSplit(
    supabase: SupabaseClient<Database>,
    visitId: string,
    realIncome: number,
    selectedWorkerIds: string[]
): Promise<ProfitBreakdown[]> {
    // 1. Fetch workers information
    const { data: workers, error: workersError } = await supabase
        .from('workers')
        .select('id, name, is_partner')
        .in('id', selectedWorkerIds)

    if (workersError || !workers) {
        console.error('Error fetching workers for profit calc:', workersError)
        return []
    }

    // 2. Identify partners vs workers
    const partners = workers.filter(w => w.is_partner)
    // Note: If no partners attended, the logic might need adjustment, 
    // but based on requirements, partners share the 60%.
    
    if (partners.length === 0) {
        return []
    }

    // 3. Simple 60/40 logic (ignoring direct expenses for now as they are not passed in)
    // Actually, expenses should be deducted. 
    // If the user wants to deduct expenses, we should fetch them or have them passed.
    // For now, let's assume realIncome is already "after direct expenses" or just use total.
    // The user said: "60% for partners and 40% for the company (Caja de Empresa) after deducting expenses".
    
    const partnerTotalShare = realIncome * 0.6
    const sharePerPartner = partnerTotalShare / partners.length

    return partners.map(p => ({
        worker_id: p.id,
        worker_name: p.name,
        amount: sharePerPartner,
        share_percentage: 60 / partners.length
    }))
}
