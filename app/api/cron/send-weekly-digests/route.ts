import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { resend } from "@/lib/resend";
import { generateWeeklyDigest } from "@/lib/weeklyDigest";
import { buildWeeklyDigestEmail } from "@/lib/weeklyDigestEmail";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const since = new Date();
    since.setDate(since.getDate() - 7);

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("onboarded", true)
      .limit(50);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    let sent = 0;

    for (const profile of profiles || []) {
      const { data: userData } = await supabase.auth.admin.getUserById(
        profile.id
      );

      const email = userData.user?.email;

      if (!email) continue;

      const { data: scans } = await supabase
        .from("scan_history")
        .select("product_name, brand, sugar, fat, salt, nova")
        .eq("user_id", profile.id)
        .gte("created_at", since.toISOString());

      if (!scans || scans.length === 0) continue;

      const digest = generateWeeklyDigest(scans);

      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "PAUSTICA <onboarding@resend.dev>",
        to: email,
        subject: "Your PAUSTICA weekly food report",
        html: buildWeeklyDigestEmail({
          email,
          ...digest,
        }),
      });

      sent++;
    }

    return NextResponse.json({
      ok: true,
      sent,
    });
  } catch (error) {
    console.error("Weekly digest cron failed:", error);

    return NextResponse.json(
      { error: "Weekly digest failed." },
      { status: 500 }
    );
  }
}