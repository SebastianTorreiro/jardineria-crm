import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export type DistributionWorker = {
    id: string
    name: string
    points: number
}

export type ProfitDistribution = {
    worker_id: string
    name: string
    amount: number
    percentage: number
}

/**
 * Pure function to calculate profit distribution based on relative points
 */
export function calculateVisitDistribution(
    total_price: number,
    direct_expenses: number,
    workers: DistributionWorker[]
): ProfitDistribution[] {
    const netMargin = total_price - direct_expenses

    if (workers.length === 0 || netMargin <= 0) {
        return []
    }

    if (workers.length === 1) {
        return [{
            worker_id: workers[0].id,
            name: workers[0].name,
            amount: Number(netMargin.toFixed(2)),
            percentage: 100
        }]
    }

    const totalPoints = workers.reduce((sum, w) => sum + w.points, 0)

    if (totalPoints === 0) {
        return []
    }

    let remainingMargin = netMargin
    let remainingPercentage = 100

    return workers.map((worker, index) => {
        const isLast = index === workers.length - 1
        
        if (isLast) {
            return {
                worker_id: worker.id,
                name: worker.name,
                amount: Number(remainingMargin.toFixed(2)),
                percentage: Number(remainingPercentage.toFixed(2))
            }
        }

        const percentage = (worker.points / totalPoints) * 100
        const amount = (worker.points / totalPoints) * netMargin
        
        const roundedAmount = Number(amount.toFixed(2))
        const roundedPercentage = Number(percentage.toFixed(2))

        remainingMargin -= roundedAmount
        remainingPercentage -= roundedPercentage

        return {
            worker_id: worker.id,
            name: worker.name,
            amount: roundedAmount,
            percentage: roundedPercentage
        }
    })
}

export async function calculateProfitSplit(
    supabase: SupabaseClient<Database>,
    visitId: string,
    totalPrice: number,
    directExpenses: number,
    selectedWorkerIds: string[]
): Promise<ProfitDistribution[]> {
    const { data: workers, error: workersError } = await supabase
        .from('workers')
        .select('id, name, is_partner, share_percentage')
        .in('id', selectedWorkerIds)

    if (workersError || !workers) {
        console.error('Error fetching workers for profit calc:', workersError)
        return []
    }

    // Only partners share the net margin. share_percentage is used as a
    // relative weight, renormalized to 100% among the selected partners for
    // this visit — same behavior as the previous name-based hardcode, just
    // sourced from the real column instead.
    const distributionWorkers: DistributionWorker[] = workers
        .filter(w => w.is_partner)
        .map(w => ({
            id: w.id,
            name: w.name,
            points: w.share_percentage
        }))

    return calculateVisitDistribution(totalPrice, directExpenses, distributionWorkers)
}
