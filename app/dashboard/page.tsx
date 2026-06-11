"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { calculateGoalScore } from "../../lib/goalScoring";

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

  const scoredScans = scans.map((scan) => ({
    ...scan,
    score: calculateGoalScore(
      "General Wellness",
      scan.sugar || 0,
      scan.fat || 0,
      scan.salt || 0,
      Number(scan.nova),
      0
    ),
  }));

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
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="PAUSTICA"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-3xl font-black text-gray-900">PAUSTICA</h1>
          </div>

         <div className="flex items-center gap-3">
  <a
    href="/"
    className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
  >
    Home
  </a>

  <button
    onClick={async () => {
      await supabase.auth.signOut();
      window.location.href = "/auth";
    }}
    className="px-5 py-3 rounded-2xl bg-red-50 text-red-600 font-bold border border-red-100"
  >
    Logout
  </button>
</div>
        </nav>

        <section className="bg-white border border-orange-100 rounded-[36px] shadow-2xl p-8 mb-8">
          <p className="text-orange-600 font-bold mb-2">Dashboard</p>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Your Nutrition Overview
          </h2>
          <p className="text-gray-500">{email}</p>
        </section>

             <section className="grid md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">Total Scans</p>
            <h3 className="text-5xl font-black text-orange-600">
              {scans.length}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">Favorites</p>
            <h3 className="text-5xl font-black text-orange-600">
              {favoritesCount}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">Average Score</p>
            <h3 className="text-5xl font-black text-orange-600">
              {averageScore}
            </h3>
          </div>

          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
            <p className="text-gray-500 font-semibold mb-2">Risk Items</p>
            <h3 className="text-5xl font-black text-red-500">
              {highSugar + ultraProcessed}
            </h3>
          </div>
          <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-lg">
  <p className="text-gray-500 font-semibold mb-2">
    Health Streak
  </p>

  <h3 className="text-5xl font-black text-green-600">
     {streak}
  </h3>
</div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-8">
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
        </section>

        <section className="bg-white border border-orange-100 rounded-[36px] shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-black text-gray-900 mb-4">
            AI Insight
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">{insight}</p>
        </section>

        <section className="bg-white border border-orange-100 rounded-[36px] shadow-xl p-8">
          <h3 className="text-3xl font-black text-gray-900 mb-6">
            Recent Activity
          </h3>

          {scans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">
              {scans.slice(0, 6).map((scan) => (
                <div
                  key={scan.id}
                  className="border border-orange-100 rounded-3xl p-5"
                >
                  <p className="font-black text-gray-900 line-clamp-2">
                    {scan.product_name}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{scan.brand}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No scan activity yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}