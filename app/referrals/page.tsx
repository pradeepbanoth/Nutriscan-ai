"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState("");
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
const [premiumDaysEarned, setPremiumDaysEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReferral = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/auth";
        return;
      }

      const res = await fetch("/api/referrals/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (data.referralCode) {
        setReferralCode(data.referralCode);

        const { data: userData } = await supabase.auth.getUser();

if (userData.user) {
  const { data: referrals } = await supabase
    .from("referrals")
    .select("reward_days")
    .eq("referrer_id", userData.user.id)
    .eq("status", "completed");

  setSuccessfulReferrals(referrals?.length || 0);

  setPremiumDaysEarned(
    referrals?.reduce((sum, item) => sum + (item.reward_days || 0), 0) || 0
  );
}
      }

      setLoading(false);
    };

    loadReferral();
  }, []);

  const referralLink =
    typeof window !== "undefined" && referralCode
      ? `${window.location.origin}/auth?ref=${referralCode}`
      : "";

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-20">
      <section className="mx-auto max-w-3xl rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-wider text-orange-600">
          PAUSTICA Referrals
        </p>

        <h1 className="mt-4 text-4xl font-black text-gray-900">
          Invite friends. Earn premium days.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-gray-500">
          Share PAUSTICA with friends. When they join, you can unlock bonus
          premium days as we roll out rewards.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
  <div className="rounded-2xl bg-orange-50 p-6">
    <p className="text-sm font-bold text-gray-500">Successful referrals</p>
    <h2 className="mt-2 text-4xl font-black text-orange-600">
      {successfulReferrals}
    </h2>
  </div>

  <div className="rounded-2xl bg-orange-50 p-6">
    <p className="text-sm font-bold text-gray-500">Premium days earned</p>
    <h2 className="mt-2 text-4xl font-black text-orange-600">
      {premiumDaysEarned}
    </h2>
  </div>
</div>

        {loading ? (
          <p className="mt-10 font-bold text-gray-500">
            Creating your referral link...
          </p>
        ) : (
          <div className="mt-10 rounded-3xl bg-orange-50 p-6">
            <p className="text-sm font-bold text-gray-500">
              Your referral code
            </p>

            <h2 className="mt-2 text-3xl font-black text-orange-600">
              {referralCode}
            </h2>

            <div className="mt-6 rounded-2xl bg-white p-4 text-sm font-bold text-gray-700 break-all">
              {referralLink}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="mt-6 rounded-2xl bg-orange-500 px-8 py-4 font-black text-white"
            >
              Copy Invite Link
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl bg-orange-50 p-5">
            <h3 className="font-black text-gray-900">Invite</h3>
            <p className="mt-2 text-sm text-gray-500">Share your link.</p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <h3 className="font-black text-gray-900">Friend joins</h3>
            <p className="mt-2 text-sm text-gray-500">
              They sign up using your code.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-5">
            <h3 className="font-black text-gray-900">Earn rewards</h3>
            <p className="mt-2 text-sm text-gray-500">
              Earn 7 premium days for every successful referral.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}