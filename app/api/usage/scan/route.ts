import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FREE_DAILY_SCAN_LIMIT = 10;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { allowed: false, error: "Missing authorization." },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json(
      { allowed: false, error: "Invalid session." },
      { status: 401 }
    );
  }

  const { data: planData } = await supabaseAdmin
    .from("user_plans")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan = planData?.plan || "free";

  if (plan === "pro" || plan === "premium") {
    return NextResponse.json({
      allowed: true,
      plan,
      remaining: null,
    });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: usage } = await supabaseAdmin
    .from("scan_usage")
    .select("scan_count")
    .eq("user_id", user.id)
    .eq("usage_date", today)
    .single();

  const currentCount = usage?.scan_count || 0;

  if (currentCount >= FREE_DAILY_SCAN_LIMIT) {
    return NextResponse.json(
      {
        allowed: false,
        plan,
        remaining: 0,
        error: "Daily free scan limit reached.",
      },
      { status: 403 }
    );
  }

  await supabaseAdmin.from("scan_usage").upsert({
    user_id: user.id,
    usage_date: today,
    scan_count: currentCount + 1,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({
    allowed: true,
    plan,
    remaining: FREE_DAILY_SCAN_LIMIT - currentCount - 1,
  });
}