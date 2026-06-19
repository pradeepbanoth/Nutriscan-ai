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
      return NextResponse.json(
        { error: "Payment verified, but payment record update failed." },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { error: "Payment verified, but premium activation failed." },
        { status: 500 }
      );
    }

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