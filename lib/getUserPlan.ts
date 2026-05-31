import { supabase } from "../app/lib/supabase";

export async function getUserPlan(userId: string) {
  const { data, error } = await supabase
    .from("user_plans")
    .select("plan")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    await supabase.from("user_plans").insert({
      user_id: userId,
      plan: "free",
    });

    return "free";
  }

  return data.plan as "free" | "premium";
}