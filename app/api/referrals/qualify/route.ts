import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { securityGuard } from "@/lib/securityEngine";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const security = await securityGuard({
  userId: user.id,
  eventName: "referral",
  request,
  metadata: {
    action: "qualify_referral",
  },
});

if (!security.allowed) {
  return NextResponse.json(
    {
      error: "Referral qualification is temporarily limited. Please try again later.",
      cooldownSeconds: security.cooldownSeconds,
    },
    { status: 429 }
  );
}

    const { event = "onboarding_completed" } = await request.json();

    const { data: referral } = await supabase
      .from("referrals")
      .select("id, referrer_id, referral_code, status")
      .eq("referred_user_id", user.id)
      .eq("status", "pending")
      .maybeSingle();

    if (!referral) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const rewardDays = 7;
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("referrals")
      .update({
        status: "completed",
        reward_days: rewardDays,
        qualification_event: event,
        qualified_at: now,
        completed_at: now,
      })
      .eq("id", referral.id)
      .eq("status", "pending");

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { error: rewardError } = await supabase.rpc(
      "add_referral_reward_days",
      {
        p_user_id: referral.referrer_id,
        p_reward_days: rewardDays,
      }
    );

    if (rewardError) {
      return NextResponse.json({ error: rewardError.message }, { status: 500 });
    }

    await supabase
  .from("referrals")
  .update({
    reward_granted: true,
  })
  .eq("id", referral.id);

  await supabase.from("referral_events").insert({
  user_id: user.id,
  referrer_id: referral.referrer_id,
  event_name: "referral_qualified",
  referral_code: referral.referral_code,
  event_data: {
    qualification_event: event,
    reward_days: rewardDays,
  },
});

    return NextResponse.json({
      ok: true,
      rewardDays,
    });
  } catch (error) {
    console.error("Referral qualification failed:", error);

    return NextResponse.json(
      { error: "Could not qualify referral." },
      { status: 500 }
    );
  }
  
}