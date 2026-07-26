import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export async function countClients(
  supabase: SupabaseClient<Database>,
  organizationId: string,
) {
  const clientsCount = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId);

  return clientsCount;
}

export async function countVisitsToday(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  today: string,
) {
  const visitsTodayCount = await supabase
    .from("visits")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .gte("scheduled_date", `${today}T00:00:00.000Z`)
    .lte("scheduled_date", `${today}T23:59:59.999Z`)
    .neq("status", "canceled");

  return visitsTodayCount;
}

export async function getMonthlyIncomeRaw(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  firstDayOfMonth: string,
  lastDayOfMonth: string,
) {
  const monthlyIncome = await supabase
    .from("visits")
    .select("real_income")
    .eq("organization_id", organizationId)
    .eq("status", "completed")
    .gte("scheduled_date", firstDayOfMonth)
    .lte("scheduled_date", lastDayOfMonth);

  return monthlyIncome;
}

export async function getTodayVisitsDetail(
  supabase: SupabaseClient<Database>,
  organizationId: string,
  today: string,
) {
  const todayVisits = await supabase
    .from("visits")
    .select(
      `
                id,
                scheduled_date,
                start_time,
                estimated_duration_mins,
                status,
                notes,
                notes_after_visit,
                total_price,
                properties (
                    address,
                    clients ( name )
                )
            `,
    )
    .eq("organization_id", organizationId)
    .gte("scheduled_date", `${today}T00:00:00.000Z`)
    .lte("scheduled_date", `${today}T23:59:59.999Z`)
    .neq("status", "canceled")
    .order("start_time", { ascending: true });

  return todayVisits;
}

export async function getSuppliesRaw(
  supabase: SupabaseClient<Database>,
  organizationId: string,
) {
  const lowStockSupplies = await supabase
    .from("supplies")
    .select("*")
    .eq("organization_id", organizationId);

  return lowStockSupplies;
}
