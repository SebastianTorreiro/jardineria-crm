import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabase = new SupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function createExpense(
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
