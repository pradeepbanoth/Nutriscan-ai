"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Script from "next/script";
import posthog from "posthog-js";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function PremiumCheckoutButton() {
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    if (!razorpayReady || !(window as any).Razorpay) {
      alert("Payment system is still loading. Please try again in a second.");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/auth";
      return;
    }
    

    posthog.capture("premium_clicked", {
      planId: "premiumMonthly",
    });

    const idempotencyKey = crypto.randomUUID();

    const res = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
  planId: "premiumMonthly",
  userId: userData.user.id,
  idempotencyKey,
}),
    });

    const data = await res.json();

    if (!res.ok) {
  alert(data.error || "Could not start payment.");
  setLoading(false);
  return;
}
    

    const options = {
      key: data.keyId,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "PAUSTICA",
      description: data.plan.name,
      order_id: data.order.id,

      handler: async function (response: any) {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...response,
            planId: data.plan.id,
            userId: userData.user.id,
          }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          alert(verifyData.error || "Payment verification failed.");
          setLoading(false);
          return;
        }

        posthog.capture("premium_activated", {
          planId: data.plan.id,
        });

        alert("Premium activated successfully.");
        window.location.href = "/profile";
      },

      modal: {
  ondismiss: function () {
    setLoading(false);
  },
},

      theme: {
        color: "#f97316",
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.on("payment.failed", function () {
      alert("Payment failed. Please try again.");
      setLoading(false);
    });

    razorpay.on("modal.closed", function () {
  setLoading(false);
});

    razorpay.open();
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayReady(true)}
      />

      <button
        onClick={startCheckout}
        disabled={!razorpayReady || loading}
        className="mt-8 block w-full rounded-2xl bg-white py-4 text-center font-black text-gray-900 disabled:opacity-60"
      >
        {loading
          ? "Opening Payment..."
          : razorpayReady
          ? "Start Premium"
          : "Loading Payment..."}
      </button>
    </>
  );
  
}
