import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { error } = await supabase.rpc(
      "expire_old_subscriptions"
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Expired subscriptions processed.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Cron failed." },
      { status: 500 }
    );
  }
}