import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  countClients,
  countVisitsToday,
  getMonthlyIncomeRaw,
  getTodayVisitsDetail,
  getSuppliesRaw,
} from "../repositories/dashboard-repository";

export async function getDashboardMetrics(
  supabase: SupabaseClient<Database>,
  organizationId: string,
) {
  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = startOfMonth(new Date()).toISOString();
  const lastDayOfMonth = endOfMonth(new Date()).toISOString();

  const [
    clientsCount,
    visitsTodayCount,
    monthlyIncome,
    todayVisits,
    lowStockSupplies,
  ] = await Promise.all([
    countClients(supabase, organizationId),
    countVisitsToday(supabase, organizationId, today),
    getMonthlyIncomeRaw(supabase, organizationId, firstDayOfMonth, lastDayOfMonth),
    getTodayVisitsDetail(supabase, organizationId, today),
    getSuppliesRaw(supabase, organizationId),
  ]);

  const totalClients = clientsCount.count ?? 0;
  const totalVisitsToday = visitsTodayCount.count ?? 0;
  const totalIncome =
    monthlyIncome.data?.reduce(
      (sum, visit) => sum + (visit.real_income || 0),
      0,
    ) ?? 0;
  const alerts =
    lowStockSupplies.data?.filter((s) => s.current_stock < s.min_stock) || [];

  return {
    totalClients,
    totalVisitsToday,
    totalIncome,
    todayVisits: todayVisits.data || [],
    alerts,
    hasLowStockAlerts: alerts.length > 0,
  };
}

export async function getAuthUser(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function getUserDisplayName(user: any): string {
  return user?.user_metadata?.name?.split(" ")[0] || "Usuario";
}
