"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { analyzeHealth } from "../../lib/healthEngine";
import Image from "next/image";

type ScanRow = {
  id: number;
  product_name: string;
  brand: string | null;
  image: string | null;
  nova: string | null;
  sugar: number | null;
  fat: number | null;
  salt: number | null;
  created_at?: string;
};


export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
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

    loadDashboard();
  }, []);

 const scoredScans = scans.map((scan) => {
  const analysis = analyzeHealth({
    sugar: scan.sugar || 0,
    fat: scan.fat || 0,
    salt: scan.salt || 0,
    nova: scan.nova || "N/A",
    ingredients: "",
    healthGoal: "General Wellness",
  });

  return {
    ...scan,
    score: analysis.score,
    grade: analysis.grade,
    label: analysis.label,
  };
});

  const averageScore =
    scoredScans.length > 0
      ? Math.round(
          scoredScans.reduce((sum, item) => sum + item.score, 0) /
            scoredScans.length
        )
      : 0;

      const recentScores = scoredScans.slice(0, 5).map((item) => item.score);
const olderScores = scoredScans.slice(5, 10).map((item) => item.score);

const recentAverage =
  recentScores.length > 0
    ? Math.round(
        recentScores.reduce((sum, score) => sum + score, 0) /
          recentScores.length
      )
    : 0;

const olderAverage =
  olderScores.length > 0
    ? Math.round(
        olderScores.reduce((sum, score) => sum + score, 0) /
          olderScores.length
      )
    : 0;

const healthTrend =
  olderScores.length === 0
    ? "Not enough data yet"
    : recentAverage > olderAverage
    ? "Improving"
    : recentAverage < olderAverage
    ? "Declining"
    : "Stable";

    const brandCounts = scans.reduce<Record<string, number>>((acc, scan) => {
  const brand = scan.brand || "Unknown Brand";

  acc[brand] = (acc[brand] || 0) + 1;

  return acc;
}, {});



  const bestProduct =
    scoredScans.length > 0
      ? [...scoredScans].sort((a, b) => b.score - a.score)[0]
      : null;

  const worstProduct =
    scoredScans.length > 0
      ? [...scoredScans].sort((a, b) => a.score - b.score)[0]
      : null;

  const highSugar = scans.filter((item) => (item.sugar || 0) > 15).length;
  const ultraProcessed = scans.filter((item) => Number(item.nova) >= 4).length;
   const uniqueDays = [
  ...new Set(
    scans
      .map((scan) =>
        scan.created_at
          ? new Date(scan.created_at).toISOString().split("T")[0]
          : null
      )
      .filter(Boolean)
  ),
];

const streak = uniqueDays.length;

const today = new Date().toISOString().split("T")[0];

const todaysScans = scans.filter(
  (scan) =>
    scan.created_at &&
    new Date(scan.created_at).toISOString().split("T")[0] === today
);

const todaysAverage =
  todaysScans.length > 0
    ? Math.round(
        todaysScans.reduce(
          (sum, item) =>
            sum +
            analyzeHealth({
              sugar: item.sugar || 0,
              fat: item.fat || 0,
              salt: item.salt || 0,
              nova: item.nova || "N/A",
              ingredients: "",
              healthGoal: "General Wellness",
            }).score,
          0
        ) / todaysScans.length
      )
    : 0;

const nextAction =
  highSugar > 3
    ? "Reduce sugary drinks today"
    : ultraProcessed > 3
    ? "Choose less processed foods"
    : "Keep building healthy habits";

  const insight =
    averageScore >= 75
      ? "Great progress. Your recent food choices look healthier overall."
      : averageScore >= 50
      ? "Your choices are mixed. Try reducing high-sugar and ultra-processed products."
      : "Your recent scans show high-risk patterns. Focus on fresher, less processed foods.";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center">
        <p className="text-gray-500 font-bold">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
           <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={48}
  height={48}
  className="object-contain"
  priority
/>
            <h1 className="text-3xl font-black text-gray-900">PAUSTICA</h1>
          </div>

         <div className="flex items-center gap-3">
  <a
    href="/scan"
    className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
  >
    Home
  </a>

 
</div>
        </nav>

        <section className="relative overflow-hidden bg-gray-900 rounded-3xl shadow-sm p-8 md:p-12 mb-8 text-white">
  <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

  <div className="relative">
    <p className="text-orange-300 font-black uppercase tracking-[0.2em] mb-3">
      Dashboard
    </p>

    <h2 className="heading-font text-4xl md:text-6xl font-black mb-4">
      Your nutrition overview
    </h2>

    <p className="text-white/60 font-semibold">{email}</p>
  </div>
</section>

            <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all">
            <p className="text-gray-500 font-semibold mb-2">Total Scans</p>
            <h3 className="text-5xl font-black text-orange-600">
              {scans.length}
            </h3>
          </div>

        

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-semibold mb-2">Average Score</p>
            <h3 className="text-5xl font-black text-orange-600">
              {averageScore}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
            <p className="text-gray-500 font-semibold mb-2">Risk Items</p>
            <h3 className="text-5xl font-black text-red-500">
              {highSugar + ultraProcessed}
            </h3>
          </div>
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm">
  <p className="text-gray-500 font-semibold mb-2">
  Health Trend
</p>

<h3 className="text-4xl font-black text-green-600">
  {healthTrend}
</h3>
</div>

        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">

<div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-sm">

<p className="text-gray-500 font-semibold mb-2">
Today's Scans
</p>

<h3 className="text-5xl font-black text-orange-600">
{todaysScans.length}
</h3>

<p className="mt-3 text-sm text-gray-500">
Stay consistent every day.
</p>

</div>

<div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-sm">

<p className="text-gray-500 font-semibold mb-2">
🔥 Current Streak
</p>

<h3 className="text-5xl font-black text-orange-600">
{streak}
</h3>

<p className="mt-3 text-sm text-gray-500">
Days you've been scanning.
</p>

</div>

<div className="bg-white border border-orange-100 rounded-3xl p-8 shadow-sm">

<p className="text-gray-500 font-semibold mb-2">
Next Action
</p>

<h3 className="text-2xl font-black text-gray-900">
{nextAction}
</h3>

<p className="mt-3 text-sm text-gray-500">
Personalized recommendation.
</p>

</div>

</section>

        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-3xl p-8 shadow-sm">
            <h3 className="heading-font text-2xl font-black text-green-700 mb-4">
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

          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 shadow-sm">
            <h3 className="heading-font text-2xl font-black text-red-700 mb-4">
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
        </section>

        <section className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8 md:p-10 mb-8">
          <h3 className="heading-font text-3xl font-black text-gray-900 mb-4">
            AI Insight
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">{insight}</p>
        </section>

        <section className="bg-white border border-orange-100 rounded-3xl shadow-sm p-8 md:p-10">
          <h3 className="heading-font text-3xl font-black text-gray-900 mb-6">
            Recent Activity
          </h3>

          {scans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {scans.slice(0, 6).map((scan) => (
                <div
                  key={scan.id}
                  className="rounded-3xl border border-orange-100 bg-orange-50/40 p-5 hover:bg-white hover:shadow-sm transition-all"
                >
                  <p className="font-black text-gray-900 line-clamp-2">
                    {scan.product_name}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{scan.brand}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-orange-100 bg-orange-50/60 p-8 text-center">
  <h4 className="text-2xl font-black text-gray-900">
    No scans yet
  </h4>

  <p className="mt-3 text-gray-500">
    Scan your first product to unlock your nutrition overview.
  </p>

  <a
    href="/"
    className="mt-6 inline-flex rounded-[20px] bg-orange-500 px-6 py-4 text-white font-black"
  >
    Start Scanning
  </a>
</div>
          )}
        </section>

      </div>
    </main>
  );
}