import { supabase } from "@/app/lib/supabase";

export async function getSubscription(userId: string) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Subscription error:", error);
    return null;
  }

  return data;
}

export async function isPremiumUser(userId: string) {
  const subscription = await getSubscription(userId);

  return (
    subscription?.status === "active" &&
    subscription?.plan === "premium"
  );
}