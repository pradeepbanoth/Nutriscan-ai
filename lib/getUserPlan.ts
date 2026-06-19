import { supabase } from "@/app/lib/supabase";

export async function getUserPlan(userId: string) {
  if (!userId) return "free";

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return "free";
  }

  if (
    data.status === "active" &&
    data.plan === "premium"
  ) {
    return "premium";
  }

  return "free";
}