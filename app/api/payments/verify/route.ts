import crypto from "crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabase } from "@/app/lib/supabase";
import { razorpayPlans } from "@/lib/razorpayPlans";
import { paymentRateLimit } from "@/lib/paymentRateLimiter";

type PlanId = keyof typeof razorpayPlans;

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return NextResponse.json({ error: "Missing payment verification details." }, { status: 400 });
    }

    if (!(planId in razorpayPlans)) {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
    }

    const userId = user.id;
    const rate = await paymentRateLimit.limit(`verify:${userId}`);

if (!rate.success) {
  return NextResponse.json(
    { error: "Too many verification attempts. Please try again shortly." },
    { status: 429 }
  );
}
    const plan = razorpayPlans[planId as PlanId];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature.length !== razorpay_signature.length) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }

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

      if (
  paymentRecord?.razorpay_payment_id &&
  paymentRecord.razorpay_payment_id !== razorpay_payment_id
) {
  return NextResponse.json(
    {
      error: "Replay attack detected.",
    },
    { status: 400 }
  );
}

    if (!paymentRecord) {
      return NextResponse.json({ error: "Payment order not found." }, { status: 404 });
    }

    if (paymentRecord.status === "paid") {
      return NextResponse.json({
        ok: true,
        message: "Payment already verified.",
      });
    }

    if (paymentRecord.plan_id !== plan.id || paymentRecord.amount !== plan.price * 100) {
      return NextResponse.json({ error: "Payment record mismatch detected." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== razorpay_order_id ||
      payment.amount !== paymentRecord.amount ||
      (payment.status !== "captured" && payment.status !== "authorized")
    ) {
      return NextResponse.json({ error: "Payment validation failed." }, { status: 400 });
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
        p_user_id: userId,
        p_order_id: razorpay_order_id,
        p_payment_id: razorpay_payment_id,
        p_billing_cycle: plan.billingCycle,
        p_start_date: now.toISOString(),
        p_end_date: endDate.toISOString(),
      }
    );

    if (activationError) {
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