import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: events, error } = await supabase
      .from("dead_letter_events")
      .select("*")
      .eq("status", "pending")
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      checked: events?.length || 0,
      message: "Dead-letter events checked. Manual retry logic can be expanded safely.",
    });
  } catch {
    return NextResponse.json(
      { error: "Dead-letter retry failed." },
      { status: 500 }
    );
  }
}