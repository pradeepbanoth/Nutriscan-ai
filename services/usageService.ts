import { supabase } from "@/app/lib/supabase";

export async function checkScanUsage() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      allowed: true,
      remaining: null,
      plan: "guest",
    };
  }

  const res = await fetch("/api/usage/scan", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  return res.json();
}