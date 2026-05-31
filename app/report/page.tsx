"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { calculateGoalScore } from "../../lib/goalScoring";
import PremiumGate from "../../components/PremiumGate";

type ScanRow = {
  id: number;
  product_name: string;
  brand: string | null;
  image: string | null;
  ingredients: string | null;
  nutriscore: string | null;
  nova: string | null;
  sugar: number | null;
  fat: number | null;
  salt: number | null;
};

export default function ReportPage() {
  const [email, setEmail] = useState("");
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const loadReport = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(data.user.email || "");

      const { data: scanData } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      const { count } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", data.user.id);

      setScans((scanData || []) as ScanRow[]);
      setFavoritesCount(count || 0);
      setLoading(false);
    };

    loadReport();
  }, []);

   const isPremium = false;

if (!isPremium) {
  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <PremiumGate
        title="report is Premium"
        description="Upgrade to scan ingredient labels from photos."
      />
    </main>
  );
}

  const scoredScans = scans.map((scan) => {
    const score = calculateGoalScore(
      "General Wellness",
      scan.sugar || 0,
      scan.fat || 0,
      scan.salt || 0,
      Number(scan.nova),
      0
    );

    return {
      ...scan,
      score,
    };
  });

  const averageScore =
    scoredScans.length > 0
      ? Math.round(
          scoredScans.reduce((sum, item) => sum + item.score, 0) /
            scoredScans.length
        )
      : 0;

  const bestProduct =
    scoredScans.length > 0
      ? [...scoredScans].sort((a, b) => b.score - a.score)[0]
      : null;

  const worstProduct =
    scoredScans.length > 0
      ? [...scoredScans].sort((a, b) => a.score - b.score)[0]
      : null;

  const highSugarCount = scans.filter((item) => (item.sugar || 0) > 15).length;
  const highSaltCount = scans.filter((item) => (item.salt || 0) > 1.5).length;
  const ultraProcessedCount = scans.filter(
    (item) => Number(item.nova) >= 4
  ).length;

  let mostCommonRisk = "No major pattern detected";

  if (
    highSugarCount >= highSaltCount &&
    highSugarCount >= ultraProcessedCount &&
    highSugarCount > 0
  ) {
    mostCommonRisk = "High Sugar";
  } else if (
    highSaltCount >= highSugarCount &&
    highSaltCount >= ultraProcessedCount &&
    highSaltCount > 0
  ) {
    mostCommonRisk = "High Salt";
  } else if (ultraProcessedCount > 0) {
    mostCommonRisk = "Ultra-Processed Foods";
  }

  const recommendation =
    averageScore >= 75
      ? "Great week. Keep choosing minimally processed foods and balanced nutrition."
      : averageScore >= 50
      ? "Moderate week. Try reducing sugary snacks, salty foods, and ultra-processed products."
      : "Your scans show frequent high-risk products. Focus on whole foods, lower sugar, and fewer packaged snacks.";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Loading report...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
         <div className="flex items-center gap-3">
  <img
    src="/logo.png"
    alt="PAUSTICA"
    className="w-12 h-12 object-contain"
  />

  <h1 className="text-3xl font-black text-gray-900">
    PAUSTICA
  </h1>
</div>

          <a
            href="/"
            className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
          >
            Home
          </a>
        </nav>

        <div className="bg-white border border-orange-100 rounded-[36px] shadow-2xl p-8 mb-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Weekly Health Report
          </h2>

          <p className="text-gray-500">{email}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">
              Total Scans
            </p>
            <h3 className="text-5xl font-black text-orange-600">
              {scans.length}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">
              Favorites
            </p>
            <h3 className="text-5xl font-black text-orange-600">
              {favoritesCount}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">
              Average Score
            </p>
            <h3 className="text-5xl font-black text-orange-600">
              {averageScore}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">
              Main Risk
            </p>
            <h3 className="text-2xl font-black text-orange-600">
              {mostCommonRisk}
            </h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-3xl p-6">
            <h3 className="text-2xl font-black text-green-700 mb-4">
              Best Product
            </h3>

            {bestProduct ? (
              <>
                <p className="text-3xl font-black text-gray-900">
                  {bestProduct.product_name}
                </p>

                <p className="text-gray-500 mt-2">
                  Score: {bestProduct.score}/100
                </p>
              </>
            ) : (
              <p className="text-gray-500">No scans yet.</p>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
            <h3 className="text-2xl font-black text-red-700 mb-4">
              Worst Product
            </h3>

            {worstProduct ? (
              <>
                <p className="text-3xl font-black text-gray-900">
                  {worstProduct.product_name}
                </p>

                <p className="text-gray-500 mt-2">
                  Score: {worstProduct.score}/100
                </p>
              </>
            ) : (
              <p className="text-gray-500">No scans yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-orange-100 rounded-[36px] shadow-xl p-8">
          <h3 className="text-3xl font-black text-gray-900 mb-4">
            AI Recommendation
          </h3>

          <p className="text-gray-700 leading-relaxed text-lg">
            {recommendation}
          </p>
        </div>
      </div>
    </main>
  );
}