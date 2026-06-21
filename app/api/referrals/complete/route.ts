import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

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

    const ipAddress =
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: "Missing referral code." },
        { status: 400 }
      );
    }

    const { data: campaign } = await supabase
      .from("referral_campaigns")
      .select("id,user_id,referral_code")
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (!campaign) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (campaign.user_id === user.id) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const { data: existingReferral } = await supabase
      .from("referrals")
      .select("id")
      .eq("referred_user_id", user.id)
      .maybeSingle();

    if (existingReferral) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const { data: existingSecurityRecord } = await supabase
  .from("referral_security")
  .select("id")
  .eq("referred_user_id", user.id)
  .maybeSingle();

if (existingSecurityRecord) {
  return NextResponse.json({ ok: true, ignored: true });
}

    const { error } = await supabase.from("referrals").insert({
      campaign_id: campaign.id,
      referrer_id: campaign.user_id,
      referred_user_id: user.id,
      referred_email: user.email,
      referral_code: campaign.referral_code,
      status: "completed",
      reward_days: 7,
      completed_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("referral_security").insert({
  referred_user_id: user.id,
  ip_address: ipAddress,
});

    await supabase.rpc("add_referral_reward_days", {
  p_user_id: campaign.user_id,
  p_reward_days: 7,
});

    return NextResponse.json({
      ok: true,
      rewardDays: 7,
    });
  } catch (error) {
    console.error("Referral completion failed:", error);

    return NextResponse.json(
      { error: "Could not complete referral." },
      { status: 500 }
    );
  }
}