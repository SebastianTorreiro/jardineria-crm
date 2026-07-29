import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export async function createExpense(
  supabase: SupabaseClient<Database>,
  data: {
    description?: string | null;
    amount: number;
    date: string;
    category: "fuel" | "equipment" | "maintenance" | "other";
  },
  organizationId: string,
) {
  const { error } = await supabase.from("expenses").insert({
    organization_id: organizationId,
    description: data.description || null,
    amount: data.amount,
    date: data.date,
    category: data.category,
  });

  return { error };
}
