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

const security = await securityGuard({
  userId: user.id,
  eventName: "referral",
  request,
  metadata: {
    action: "complete_referral",
    referral_code: referralCode,
  },
});

if (!security.allowed) {
  return NextResponse.json(
    {
      error:
        "Referral actions are temporarily limited. Please try again later.",
      cooldownSeconds: security.cooldownSeconds,
    },
    { status: 429 }
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
      status: "pending",
      reward_days: 0,
      qualification_event: "signup",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("referral_security").insert({
  referred_user_id: user.id,
  ip_address: ipAddress,
});

await supabase.from("referral_events").insert({
  user_id: user.id,
  referrer_id: campaign.user_id,
  event_name: "referral_completed",
  referral_code: campaign.referral_code,
  event_data: {
    status: "pending",
    ip_address: ipAddress,
  },
});   

   return NextResponse.json({
  ok: true,
  status: "pending",
});

  } catch (error) {
    console.error("Referral completion failed:", error);

    return NextResponse.json(
      { error: "Could not complete referral." },
      { status: 500 }
    );
  }
}