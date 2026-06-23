import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { generateReferralCode } from "@/lib/generateReferralCode";
import { securityGuard } from "@/lib/securityEngine";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "User not found." }, { status: 401 });
    }

    const security = await securityGuard({
  userId: user.id,
  eventName: "referral",
  request,
  metadata: {
    action: "create_referral_code",
  },
});

if (!security.allowed) {
  return NextResponse.json(
    {
      error: "Referral actions are temporarily limited. Please try again later.",
      cooldownSeconds: security.cooldownSeconds,
    },
    { status: 429 }
  );
}

    const { data: existingCampaign } = await supabase
      .from("referral_campaigns")
      .select("referral_code")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingCampaign) {
      return NextResponse.json({
        ok: true,
        referralCode: existingCampaign.referral_code,
      });
    }

    const referralCode = generateReferralCode(user.id);

    const { error } = await supabase.from("referral_campaigns").insert({
      user_id: user.id,
      referral_code: referralCode,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      referralCode,
    });
  } catch (error) {
    console.error("Referral creation failed:", error);

    return NextResponse.json(
      { error: "Could not create referral." },
      { status: 500 }
    );
  }
}