import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { razorpayPlans } from "@/lib/razorpayPlans";
import { supabase } from "@/app/lib/supabase";

type PlanId = keyof typeof razorpayPlans;

export async function POST(request: Request) {
  try {
   const { planId, userId, idempotencyKey } = await request.json();

if (!userId) {
  return NextResponse.json(
    { error: "User not authenticated." },
    { status: 401 }
  );
}

if (!idempotencyKey) {
  return NextResponse.json(
    { error: "Missing idempotency key." },
    { status: 400 }
  );
}

if (!planId || !(planId in razorpayPlans)) {
  return NextResponse.json(
    { error: "Invalid plan selected." },
    { status: 400 }
  );
}

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay is not configured." },
        { status: 500 }
      );
    }

    const plan = razorpayPlans[planId as PlanId];

const { data: existingPayment } = await supabase
  .from("payments")
  .select("*")
  .eq("idempotency_key", idempotencyKey)
  .eq("user_id", userId)
  .maybeSingle();

if (existingPayment) {
  return NextResponse.json({
    ok: true,
    reused: true,
    order: {
      id: existingPayment.razorpay_order_id,
      amount: existingPayment.amount,
      currency: existingPayment.currency,
    },
    keyId: process.env.RAZORPAY_KEY_ID,
    plan,
  });
}

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: plan.currency,
      receipt: `paustica_${plan.id}_${Date.now()}`,
      notes: {
        planId: plan.id,
        billingCycle: plan.billingCycle,
      },
    });

    const { data: paymentRecord, error: paymentInsertError } =
  await supabase
    .from("payments")
    .insert({
      user_id: userId,

      razorpay_order_id: order.id,

      idempotency_key: idempotencyKey,

      plan_id: plan.id,

      amount: plan.price * 100,

      currency: plan.currency,

      status: "created",
    })
    .select("id")
    .single();

if (paymentInsertError || !paymentRecord) {
  return NextResponse.json(
    {
      error: "Payment order created, but saving payment failed.",
    },
    { status: 500 }
  );
}

await supabase.from("payment_events").insert({
  payment_id: paymentRecord.id,

  user_id: userId,

  event_type: "order_created",

  event_data: {
    razorpay_order_id: order.id,

    plan_id: plan.id,

    amount: plan.price * 100,

    currency: plan.currency,

    idempotency_key: idempotencyKey,
  },
});

    return NextResponse.json({
      ok: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan,
    });
  } catch (error) {
    console.error("Create Razorpay order failed:", error);

    return NextResponse.json(
      { error: "Could not create payment order." },
      { status: 500 }
    );
  }
}