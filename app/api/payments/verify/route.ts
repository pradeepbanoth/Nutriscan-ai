import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabase } from "@/app/lib/supabase";
import { razorpayPlans } from "@/lib/razorpayPlans";

type PlanId = keyof typeof razorpayPlans;

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      userId,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId || !userId) {
      return NextResponse.json({ error: "Missing payment verification details." }, { status: 400 });
    }

    if (!(planId in razorpayPlans)) {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
    }

    const plan = razorpayPlans[planId as PlanId];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

    const { data: paymentRecord } = await supabase
      .from("payments")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!paymentRecord) {
      return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
    }

    if (paymentRecord.status === "paid") {
      return NextResponse.json({
        ok: true,
        message: "Payment already verified.",
      });
    }

    if (paymentRecord.plan_id !== plan.id) {
      return NextResponse.json({ error: "Plan mismatch detected." }, { status: 400 });
    }

    if (paymentRecord.amount !== plan.price * 100) {
      return NextResponse.json({ error: "Amount mismatch detected." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: "Order mismatch detected." }, { status: 400 });
    }

    if (payment.amount !== paymentRecord.amount) {
      return NextResponse.json({ error: "Paid amount mismatch detected." }, { status: 400 });
    }

    if (payment.status !== "captured" && payment.status !== "authorized") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 400 });
    }

    const now = new Date();
    const endDate = new Date(now);

    if (plan.billingCycle === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const { error: paymentUpdateError } = await supabase
      .from("payments")
      .update({
        razorpay_payment_id,
        status: "paid",
        updated_at: now.toISOString(),
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("user_id", userId);

    if (paymentUpdateError) {
  await supabase.from("dead_letter_events").insert({
    event_type: "payment_record_update_failed",
    source: "razorpay_verify",
    payload: {
      userId,
      planId: plan.id,
      razorpay_order_id,
      razorpay_payment_id,
    },
    error_message: paymentUpdateError.message,
    status: "pending",
  });

  return NextResponse.json(
    { error: "Payment verified, but payment record update failed. Our team can retry it safely." },
    { status: 500 }
  );
}

await supabase.from("payment_events").insert({
  payment_id: paymentRecord.id,
  user_id: userId,
  event_type: "payment_verified",
  event_data: {
    razorpay_order_id,
    razorpay_payment_id,
    plan_id: plan.id,
    amount: paymentRecord.amount,
    currency: paymentRecord.currency,
  },
});

    const { error: subscriptionError } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      plan: "premium",
      status: "active",
      billing_cycle: plan.billingCycle,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      updated_at: now.toISOString(),
    });

    if (subscriptionError) {
  await supabase.from("dead_letter_events").insert({
    event_type: "premium_activation_failed",
    source: "razorpay_verify",
    payload: {
      userId,
      planId: plan.id,
      billingCycle: plan.billingCycle,
      razorpay_order_id,
      razorpay_payment_id,
      paymentRecordId: paymentRecord.id,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
    },
    error_message: subscriptionError.message,
    status: "pending",
  });

  return NextResponse.json(
    { error: "Payment verified, but premium activation failed. Our team can retry it safely." },
    { status: 500 }
  );
}

await supabase.from("payment_events").insert({
  payment_id: paymentRecord.id,
  user_id: userId,
  event_type: "subscription_activated",
  event_data: {
    plan: "premium",
    billing_cycle: plan.billingCycle,
    start_date: now.toISOString(),
    end_date: endDate.toISOString(),
  },
});

    return NextResponse.json({
      ok: true,
      message: "Premium activated.",
    });
  } catch (error) {
    console.error("Payment verification failed:", error);

    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 }
    );
  }
}