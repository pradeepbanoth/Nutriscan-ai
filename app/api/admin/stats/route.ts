import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const [
      users,
      premiumUsers,
      totalScans,
      paidPayments,
      failedPayments,
      deadLetters,
      revenueRows,
      todayScans,
      todayPaidPayments,
      todayRevenueRows,
      deadLetterRows,
      failedPaymentRows,
    ] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 }),

      supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),

      supabaseAdmin.from("scan_history").select("*", { count: "exact", head: true }),

      supabaseAdmin.from("payments").select("*", { count: "exact", head: true }).eq("status", "paid"),

      supabaseAdmin.from("payments").select("*", { count: "exact", head: true }).eq("status", "failed"),

      supabaseAdmin.from("dead_letter_events").select("*", { count: "exact", head: true }).eq("status", "pending"),

      supabaseAdmin.from("payments").select("amount").eq("status", "paid"),

      supabaseAdmin.from("scan_history").select("*", { count: "exact", head: true }).gte("created_at", todayISO),

      supabaseAdmin.from("payments").select("*", { count: "exact", head: true }).eq("status", "paid").gte("created_at", todayISO),

      supabaseAdmin.from("payments").select("amount").eq("status", "paid").gte("created_at", todayISO),

      supabaseAdmin.from("dead_letter_events").select("event_type,error_message,status").eq("status", "pending").limit(5),

      supabaseAdmin.from("payments").select("razorpay_order_id,status").eq("status", "failed").limit(5),
    ]);

    const revenue =
      revenueRows.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    const todayRevenue =
      todayRevenueRows.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    return NextResponse.json({
      stats: [
        { label: "Total Users", value: users.data?.users?.length ?? "—", note: "Current page count" },
        { label: "Premium Users", value: premiumUsers.count || 0 },
        { label: "Total Scans", value: totalScans.count || 0 },
        { label: "Today Scans", value: todayScans.count || 0 },
        { label: "Revenue", value: `₹${Math.round(revenue / 100)}` },
        { label: "Today Revenue", value: `₹${Math.round(todayRevenue / 100)}` },
        { label: "Paid Payments", value: paidPayments.count || 0 },
        { label: "Today Payments", value: todayPaidPayments.count || 0 },
        { label: "Failed Payments", value: failedPayments.count || 0 },
        { label: "Dead Letters", value: deadLetters.count || 0 },
      ],

      issues: [
        ...((deadLetterRows.data || []).map((item) => ({
          title: item.event_type || "Dead letter event",
          detail: item.error_message || "Needs review",
          status: item.status || "pending",
        }))),

        ...((failedPaymentRows.data || []).map((item) => ({
          title: "Failed payment",
          detail: item.razorpay_order_id || "Unknown order",
          status: item.status || "failed",
        }))),
      ],
    });
  } catch (error) {
    console.error("Admin stats failed:", error);

    return NextResponse.json({ error: "Admin stats failed." }, { status: 500 });
  }
}