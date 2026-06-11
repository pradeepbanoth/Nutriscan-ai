import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Missing authorization." },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json(
      { error: "Invalid session." },
      { status: 401 }
    );
  }

  await supabaseAdmin.from("favorites").delete().eq("user_id", user.id);
  await supabaseAdmin.from("scan_history").delete().eq("user_id", user.id);
  await supabaseAdmin.from("scans").delete().eq("user_id", user.id);
  await supabaseAdmin.from("scan_usage").delete().eq("user_id", user.id);
  await supabaseAdmin.from("user_plans").delete().eq("user_id", user.id);
  await supabaseAdmin.from("profiles").delete().eq("id", user.id);

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id
  );

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete account." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}