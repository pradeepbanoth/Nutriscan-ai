import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { razorpayPlans } from "@/lib/razorpayPlans";


export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook secret is not configured." },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Razorpay signature." },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (
      expectedSignature.length !== signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      )
    ) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    if (event.event !== "payment.captured") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const payment = event.payload?.payment?.entity;

    if (!payment?.id || !payment?.order_id) {
      return NextResponse.json(
        { error: "Invalid payment payload." },
        { status: 400 }
      );
    }

    const { data: paymentRecord } = await supabase
      .from("payments")
      .select("*")
      .eq("razorpay_order_id", payment.order_id)
      .maybeSingle();

    if (!paymentRecord) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (paymentRecord.status === "paid") {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const planKey = Object.keys(razorpayPlans).find(
      (key) =>
        razorpayPlans[key as keyof typeof razorpayPlans].id ===
        paymentRecord.plan_id
    ) as keyof typeof razorpayPlans | undefined;

    if (!planKey) {
      return NextResponse.json(
        { error: "Unknown plan for payment." },
        { status: 400 }
      );
    }

    const plan = razorpayPlans[planKey];

    if (payment.amount !== paymentRecord.amount) {
      return NextResponse.json(
        { error: "Webhook amount mismatch." },
        { status: 400 }
      );
    }

    const now = new Date();
    const endDate = new Date(now);

    if (plan.billingCycle === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const { error: activationError } = await supabase.rpc(
      "activate_premium_after_payment",
      {
        p_user_id: paymentRecord.user_id,
        p_order_id: payment.order_id,
        p_payment_id: payment.id,
        p_billing_cycle: plan.billingCycle,
        p_start_date: now.toISOString(),
        p_end_date: endDate.toISOString(),
      }
    );

    if (activationError) {
      return NextResponse.json(
        { error: "Webhook activation failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Razorpay webhook failed:", error);

    return NextResponse.json(
      { error: "Webhook handling failed." },
      { status: 500 }
    );
  }
}