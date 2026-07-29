import {
  getMonthlyFinancialSummary,
  getExpenses,
} from "@/lib/services/finance-service";
import { SummaryCard } from "@/components/finances/SummaryCard";
import { ExpenseList } from "@/components/finances/ExpenseList";
import { NewExpenseDrawer } from "@/components/finances/NewExpenseDrawer";
import { ProfitDistribution } from "@/components/finances/ProfitDistribution";
import { format, subMonths, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getUserOrganization } from "@/utils/supabase/queries";

// Force dynamic to ensure fresh metrics on every load
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FinancesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const organizationId = await getUserOrganization(supabase);
  const resolvedParams = await searchParams;

   if (!organizationId) return [];

  const now = new Date();
  const monthParam = resolvedParams.month;
  const yearParam = resolvedParams.year;

  // Default to current month/year if not provided
  // Math: Parse int, default to now.getMonth() (0-11)
  const selectedMonth = monthParam
    ? parseInt(monthParam as string)
    : now.getMonth();
  const selectedYear = yearParam
    ? parseInt(yearParam as string)
    : now.getFullYear();

  // Create Date object for display/navigation logic
  // Note: Month in date-fns/JS is 0-indexed (Jan=0, Dec=11)
  const currentDate = new Date(selectedYear, selectedMonth, 1);

  // Fetch Data in Parallel
  const [summary, expenses] = await Promise.all([
    getMonthlyFinancialSummary(supabase, organizationId, selectedMonth, selectedYear),
    getExpenses(supabase, organizationId, selectedMonth, selectedYear),
  ]);

  // Navigation Links
  const prevDate = subMonths(currentDate, 1);
  const nextDate = addMonths(currentDate, 1);

  const prevLink = `/finances?month=${prevDate.getMonth()}&year=${prevDate.getFullYear()}`;
  const nextLink = `/finances?month=${nextDate.getMonth()}&year=${nextDate.getFullYear()}`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-20">
      <div className="p-4 max-w-7xl mx-auto w-full">
        {/* Header with Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black text-emerald-950 tracking-tight">
            Finanzas
          </h1>

          <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
            <Link
              href={prevLink}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <span className="w-36 text-center text-sm font-bold text-emerald-900 capitalize">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </span>
            <Link
              href={nextLink}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCard summary={summary.summary} />

        {/* Profit Distribution */}
        <ProfitDistribution summary={summary.payouts} />

        {/* Expense List */}
        <div className="mt-8">
          <ExpenseList expenses={expenses || []} />
        </div>
      </div>

      <NewExpenseDrawer />
    </div>
  );
}
